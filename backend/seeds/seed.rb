#!/usr/bin/env ruby

require "open-uri"
require "zlib"
require "mongo"
require_relative "models"

Mongo::Logger.logger.level = ::Logger::FATAL

#   set up mongo client
client = Mongo::Client.new(["127.0.0.1:27017"])
db = client.use("movies")

MODELS = [TitleRating, TitleBasic, TitlePrincipal, TitleAka, NameBasic]

URL = "https://datasets.imdbws.com/"
MAX_BATCH = 3000

# file_names = %w(name.basics title.akas title.basics title.crew title.episode title.principal title.ratings).map { |name| name + ".tsv.gz" }
# table_names = %w(name_basic title_aka title_basic title_crew title_episode title_principal title_rating).map(&:to_sym)
# names = file_names.zip(table_names)

def expanded_path(file_name)
  File.join(File.expand_path(File.dirname(__FILE__)), file_name)
end

def seed_single_id_records(table, model)
  p "Seeding table"
  file_name, table_name = model.names

  batch = []
  firstLine = true
  count = 0

  #   open up zip file and start reading
  Zlib::GzipReader.open(expanded_path(file_name)) do |reader|
    reader.each_line do |line|
      if firstLine
        firstLine = false
        next
      end

      line = line.chomp.split("\t")

      batch << model.to_hash(*line)

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

  p "#{count} rows were added for #{table_name}"
end

def download_file(file_name)
  p "Downloading file: #{file_name}"
  download = open(URL + file_name)
  IO.copy_stream(download, File.join(File.expand_path(File.dirname(__FILE__)), file_name))
end

MODELS.each do |model|
  file_name, table_name = model.names
  p model.names

  #   download file
  # return p "Skipping pre-seeded section" unless File.exists?(expanded_path(file_name))
  download_file(file_name) unless File.exists?(expanded_path(file_name))

  #   drop the table to run again - very inefficient
  p "Creating connection to #{table_name}"
  table = db[table_name]
  p "Dropping table"
  table.drop

  seed_single_id_records(table, model)

  if model.custom_indexes
    p "Creating index: #{model.custom_indexes}"
    table.indexes.create_many(model.custom_indexes.map {|index| {key: index}})
  end
end

client.close
p "Finished Writing documents"
