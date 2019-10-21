require "open-uri"
require "zlib"
require "mongo"
require_relative "models"
require "set"

Mongo::Logger.logger.level = ::Logger::FATAL

#   set up mongo client
client = Mongo::Client.new(["127.0.0.1:27017"])
db = client.use("movies")

MODELS = [TitleRating, TitleBasic]

URL = "https://datasets.imdbws.com/"
MAX_BATCH = 2500

# file_names = %w(name.basics title.akas title.basics title.crew title.episode title.principal title.ratings).map { |name| name + ".tsv.gz" }
# table_names = %w(name_basic title_aka title_basic title_crew title_episode title_principal title_rating).map(&:to_sym)
# names = file_names.zip(table_names)

def expanded_path(file_name)
    File.join(File.expand_path(File.dirname(__FILE__)), file_name)
end

def seed_single_id_records(table, model)
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
        result = table.insert_many(batch)
        batch = []
      end

      count += 1
    end
  end

  unless batch.empty?
    result = table.insert_many(batch)
  end

  puts "#{count} rows were added for #{table_name}"
end

def seed_multi_id_records(table, model)
  file_name, table_name = model.names

  batch = []
  firstLine = true
  headers = nil
  count = 0
  last_record = {}

  #   open up zip file and start reading
  Zlib::GzipReader.open(file_name) do |reader|
    reader.each_line do |line|
      if firstLine
        headers = line.gsub("tconst", "_id").chomp.split("\t")
        firstLine = false
        next
      end

      line = line.chomp.split("\t")
      id = line.first

      hash = model.to_hash(*line)

      if id > "tt1000000"
        if hash[:variations].first[:ordering] == 1
          table.insert_one(hash)
        else
          table.update_one({ _id: id }, "$push" => { variations: hash[:variations] })
        end
        next
      end

      if last_record[:_id] == id
        last_record[:variations] << hash[:variations]
        next
      elsif last_record[:_id]
        batch << last_record
        last_record = {}
      end

      last_record = model.to_hash(*line)
      if batch.size >= MAX_BATCH
        result = table.insert_many(batch)
        batch = []
      end

      count += 1
      if count == 1001000
        break
      end
    end
  end

  batch << last_record unless last_record[:_id]

  unless batch.empty?
    result = table.insert_many(batch)
  end

  puts "#{count} rows were added for #{table_name}"
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
  download_file(file_name) unless File.exists?(expanded_path(file_name))

  #   drop the table to run again - very inefficient
  table = db[table_name]
  table.drop

  if model.has_duplicate_ids
    seed_multi_id_records(table, model)
  else
    seed_single_id_records(table, model)
  end
end

client.close
puts "Finished Writing documents"
