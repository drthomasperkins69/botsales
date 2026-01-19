# Markdown to Word Converter

A web application that accepts multiple Markdown (.md) files and converts them into a single combined Word document.

## Features

- Upload multiple .md files via drag-and-drop or file browser
- Combines all files into one Word document with page breaks between sections
- Supports common Markdown formatting:
  - Headers (H1-H6)
  - Bold and italic text
  - Inline code and code blocks
  - Ordered and unordered lists
  - Blockquotes
  - Links
  - Horizontal rules

## Installation

```bash
pip install -r requirements.txt
```

## Usage

1. Start the server:
   ```bash
   python app.py
   ```

2. Open your browser and navigate to `http://localhost:5000`

3. Drag and drop your .md files or click to browse

4. Click "Convert to Word Document" to download the combined document

## Project Structure

```
convert-markdown/
├── app.py              # Flask web application
├── converter.py        # Markdown to Word conversion logic
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html      # Upload form frontend
└── README.md
```

## API Endpoints

- `GET /` - Upload form page
- `POST /convert` - Accepts file uploads and returns the Word document
- `GET /health` - Health check endpoint

## Requirements

- Python 3.8+
- Flask
- python-docx
- markdown
