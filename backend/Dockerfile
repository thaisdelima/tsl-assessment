# 1. Use an official Python image compatible with Django 6.x
FROM python:3.12-slim

# 2. Set environment variables to keep Python from buffering output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set the working directory inside the container
WORKDIR /app

# 4. Install dependencies
# We copy requirements first to leverage Docker's cache
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of the project code
COPY . /app/

# 6. Expose the port Django runs on
EXPOSE 8000

# 7. Start the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]