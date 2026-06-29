# Faculty Guide

Welcome to the Faculty portal. This dashboard acts as your Content Management System (CMS) where you can build, manage, and deploy courses for students.

## Accessing the Dashboard
Navigate to `/faculty` in your browser. This is your command center.

![Faculty Dashboard Overview](screenshots/faculty_dashboard.png)
*Note: Insert a screenshot of the main faculty dashboard here.*

## 1. Managing Subjects & Modules

The curriculum is structured hierarchically: **Subjects -> Modules -> Subtopics**.

- **Create a Subject:** Click on "Add Subject". Provide a title and description.
- **Add Modules:** Within a subject, you can add multiple modules (chapters).
- **Subtopics:** Inside modules, you can create specific lessons, flashcards, or quizzes.

## 2. Creating Content Types

### Flashcards
You can create interactive flashcards for students to review.
1. Navigate to the desired module.
2. Select **Add Flashcard Deck**.
3. You can either create cards manually or upload a `.csv` file. 
   - **Tip:** You can easily generate flashcard CSVs using the [NotebookLM Flashcards Exporter](https://chromewebstore.google.com/detail/notebooklm-flashcards-exp/gfpdgeimnjeibphkimmeeigedjffdnnp) extension.
4. The system will parse the `.csv` and instantly generate the deck.

![Flashcard Creation](screenshots/flashcard_creation.png)
*Note: Insert a screenshot of the flashcard creation UI.*

### Quizzes
Assess student knowledge with timed quizzes.
1. Select **Add Quiz**.
2. Define the quiz parameters (Time limit, passing score).
3. Add multiple-choice questions.
   - **Tip:** You can generate a CSV of questions using the [NotebookLM Quiz Exporter](https://chromewebstore.google.com/detail/notebooklm-quiz-exporter/pndhmfhdeoiekihofmklndionkfabbdm) extension. Ensure that the "hints" button is unclicked before downloading the CSV.

## 3. Data Storage (Google Sheets)

Because the system uses Google Sheets as a backend, all your data is safely stored in a spreadsheet you can access anytime.
If you need to make bulk edits or fix typos quickly, you can open the connected Google Sheet and edit the cells directly. 
*Warning: Do not change the column headers or the sheet names, as this will break the connection.*

## 4. Deploying Updates

Once you have finished adding or modifying content:
1. The platform will automatically sync changes to the database.
2. If the deployment trigger is configured, you can click the **Deploy to Production** button. This uses a GitHub Action to rebuild the student portal with your latest content, ensuring students get lightning-fast page loads.

![Deployment Button](screenshots/deploy_button.png)
*Note: Insert a screenshot of the deploy button.*
