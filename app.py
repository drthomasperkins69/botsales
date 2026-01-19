"""
Flask application for converting multiple Markdown files to a combined Word document.
"""

import os
import tempfile
from flask import Flask, request, render_template, send_file, flash, redirect, url_for
from werkzeug.utils import secure_filename
from converter import MarkdownToWordConverter

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

ALLOWED_EXTENSIONS = {'md'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max total upload size

app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH


def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET'])
def index():
    """Render the upload form."""
    return render_template('index.html')


@app.route('/convert', methods=['POST'])
def convert():
    """Handle file uploads and convert markdown files to Word document."""
    if 'files' not in request.files:
        flash('No files selected', 'error')
        return redirect(url_for('index'))

    files = request.files.getlist('files')

    if not files or all(f.filename == '' for f in files):
        flash('No files selected', 'error')
        return redirect(url_for('index'))

    # Filter valid markdown files
    valid_files = []
    for file in files:
        if file and file.filename and allowed_file(file.filename):
            valid_files.append(file)

    if not valid_files:
        flash('No valid markdown (.md) files found', 'error')
        return redirect(url_for('index'))

    # Read markdown content from files
    markdown_contents = []
    for file in valid_files:
        filename = secure_filename(file.filename)
        content = file.read().decode('utf-8')
        markdown_contents.append({
            'filename': filename,
            'content': content
        })

    # Sort files alphabetically by filename for consistent ordering
    markdown_contents.sort(key=lambda x: x['filename'])

    # Convert to Word document
    converter = MarkdownToWordConverter()

    # Create a temporary file for the output
    with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp_file:
        output_path = tmp_file.name

    try:
        converter.convert(markdown_contents, output_path)

        # Send the file to the user
        return send_file(
            output_path,
            as_attachment=True,
            download_name='combined_document.docx',
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    finally:
        # Clean up the temporary file after sending
        if os.path.exists(output_path):
            os.unlink(output_path)


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return {'status': 'healthy'}, 200


if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)
