class Model
  def self.names
    [self.file_name, @table_name]
  end
  def self.file_name
    @file_name + ".tsv.gz"
  end
  def self.has_duplicate_ids
    @has_duplicate_ids || false
  end
end

class TitleBasic < Model
  @table_name = "titlebasics"
  @file_name = "title.basics"

  def self.to_hash(_id, title_type, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes, genres)
    {
      _id: _id,
      title_type: title_type,
      primary_title: primary_title,
      original_title: original_title,
      is_adult: is_adult.to_i == 1,
      start_year: start_year.to_i,
      end_year: (end_year.to_i if Float(end_year) rescue nil),
      runtime_minutes: runtime_minutes.to_i,
      genres: genres.split(","),
    }
  end
end

class TitleRating < Model
  @table_name = "titleratings"
  @file_name = "title.ratings"

  def self.to_hash(_id, average_rating, num_votes)
    {
      _id: _id,
      average_rating: average_rating.to_f,
      num_votes: num_votes.to_i,
    }
  end
end

class TitleAka < Model
  @table_name = :title_aka
  @file_name = "title.akas"
  @has_duplicate_ids = true

  def self.to_hash(_id, ordering, title, region, language, types, attributes, isOriginalTitle)
    {
      _id: _id,
      variations: [{
        ordering: ordering.to_i,
        title: title,
        region: region,
        language: language,
        types: types,
        attributes: attributes,
        isOriginalTitle: isOriginalTitle.to_i == 1,
      }],
    }
  end

  def self.make_variation(_id, ordering, title, region, language, types, attributes, isOriginalTitle)
    {
      ordering: ordering.to_i,
      title: title,
      region: region,
      language: language,
      types: types,
      attributes: attributes,
      isOriginalTitle: isOriginalTitle.to_i == 1,
    }
  end
end
