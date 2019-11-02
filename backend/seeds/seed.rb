#!/usr/bin/env ruby

require "open-uri"
require "zlib"
require "mongo"
require "sparql/client"
require_relative "models"

Mongo::Logger.logger.level = ::Logger::FATAL

#   set up mongo client
client = Mongo::Client.new(["127.0.0.1:27017"])
db = client.use("movies")

MODELS = [TitleRating, TitleBasic, TitlePrincipal, TitleAka, NameBasic, WikidataBasic]

URL = "https://datasets.imdbws.com/"
MAX_BATCH = 3000

def expanded_path(file_name)
  File.join(File.expand_path(File.dirname(__FILE__)), file_name)
end

def seed_imdb_records(table, model)
  p "Seeding table"

  batch = []
  firstLine = true
  count = 0

  #   open up zip file and start reading
  Zlib::GzipReader.open(expanded_path(model.file_name)) do |reader|
    reader.each_line do |line|
      if firstLine
        firstLine = false
        next
      end

      line = line.chomp.split("\t")
      hash =  model.to_hash(*line)

      batch << hash if hash

      if batch.size == MAX_BATCH
        table.insert_many(batch)
        batch = []
      end

      count += 1
    end
  end

  unless batch.empty?
    table.insert_many(batch)
  end

  p "#{count} rows were added for #{model.table_name}"
end

def seed_wikidata_records(table, model)
  p "Seeding table"

  batch = []
  firstLine = true
  count = 0

  endpoint = "https://query.wikidata.org/sparql"
  sparql = %(
    SELECT ?item ?IMDb_ID ?DNF_film_ID WHERE {
      OPTIONAL { ?item wdt:P345 ?IMDb_ID. }
      OPTIONAL { ?item wdt:P18 ?DNF_film_ID. }
    })

  client = SPARQL::Client.new(endpoint, headers: { "User-Agent" => "6DegreesOfActors" }, :method => :get)
  rows = client.query(sparql)

  for row in rows
    data = row.map { |key, val| val.to_s }
    batch << model.to_hash(*data)

    if batch.size == MAX_BATCH
      table.insert_many(batch)
      batch = []
    end

    count += 1
  end

  unless batch.empty?
    table.insert_many(batch)
  end

  p "#{count} rows were added for #{model.table_name}"
end

def download_file(file_name)
  return unless File.exists?(expanded_path(file_name))
  p "Downloading file: #{file_name}"
  download = open(URL + file_name)
  IO.copy_stream(download, File.join(File.expand_path(File.dirname(__FILE__)), file_name))
end

MODELS.each do |model|
  table_name = model.table_name
  p "Starting #{table_name}"

  #   download file
  download_file(model.file_name) if model.data_source == :imdb

  #   drop the table to run again - very inefficient
  p "Creating connection to #{table_name}"
  table = db[table_name]
  p "Dropping table"
  table.drop

  case model.data_source
  when :imdb
    seed_imdb_records(table, model)
  when :wikidata
    seed_wikidata_records(table, model)
  end

  if model.custom_indexes
    p "Creating index: #{model.custom_indexes}"
    table.indexes.create_many(model.custom_indexes.map { |index| { key: index } })
  end
end

client.close
p "Finished Writing documents"
