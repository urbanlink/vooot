# voOot extractors

An extractor extracts data from an external source and returns the data in a voOot understandable way. An extractor is used as a helper, when calling an extractor it tries to fetch the required data and
There are two main types of extractors: Mass extractor and Item extractor.

## Mass extractor
A mass extractor tries to extract all relevant data from an external source. It tries to create a list of items that can be extracted individually.
For example, the *almanak_person_mass_extractor* tries to fetch all unique id's of all person's that are currently registered in the almanak.overheid.nl website. This list can then be user by the *almanak_person_item_extractor*.
The mass extractor is different for each type of extractor because of the different ways to handle the extraction.
The mass extractor is usually used only once, to insert items in the database at start, or to do a big synchronization. Normally this is done manually. (as opposed to an item extractor, which can be handled automatically).

## Item extractor
f


## Almanak Extractor
### Organization
#### Mass extractor
Fetch all organizations from the almanak
#### Item extractor

### Person
#### Mass extractor
Fetch all persons from the almanak
#### Item extractor
Fetch 1 person from the almanak
