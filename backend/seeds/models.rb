class Model
  def self.names
    [self.file_name, @table_name]
  end

  def self.file_name
    @file_name + ".tsv.gz"
  end

  def self.custom_indexes
    @custom_indexes
  end
end

class TitleBasic < Model
  @table_name = "titlebasics"
  @file_name = "title.basics"
  @custom_indexes = [{title_type: 1, primary_title: "text"}]

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
  @table_name = "titleakas"
  @file_name = "title.akas"
  @custom_indexes = [{tconst: 1}]

  def self.to_hash(tconst, ordering, title, region, language, types, attributes, isOriginalTitle)
    {
        tconst: tconst,
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

class TitlePrincipal < Model
  @table_name = "titleprincipals"
  @file_name = "title.principals"
  @custom_indexes = [{tconst: 1}, {nconst: 1}]

  def self.to_hash(tconst, ordering, nconst, category, job, characters)
    {
        tconst: tconst,
        ordering: ordering.to_i,
        nconst: nconst,
        category: category,
        job: job,
        characters: characters
    }
  end
end

class NameBasic < Model
  @table_name = "namebasics"
  @file_name = "name.basics"
  @custom_indexes = [{primary_name: "text"}]

  def self.to_hash(_id, primary_name, birthYear, deathYear, primaryProfession, knownForTitles)
    {
        _id: _id,
        primary_name: primary_name,
        birthYear: birthYear,
        deathYear: deathYear,
        primaryProfession: primaryProfession.split(","),
        knownForTitles: knownForTitles.split(","),
    }
  end
end