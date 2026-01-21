FROM python:3.12-slim

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=setup.settings

# Working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gunicorn

# Copy the rest of the project code
COPY . /app/

# Expose the application port
EXPOSE 8000

# Start the WSGI server with Gunicorn
CMD ["gunicorn", "setup.wsgi:application", "--bind", "0.0.0.0:8000"]