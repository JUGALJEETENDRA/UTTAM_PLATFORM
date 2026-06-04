\copy (SELECT * FROM "Question") TO 'database_export/Question.csv' WITH CSV HEADER;
\copy (SELECT * FROM "Flashcard") TO 'database_export/Flashcard.csv' WITH CSV HEADER;
