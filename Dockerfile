FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files (SECRET_KEY only needed at build time for this step)
RUN SECRET_KEY=build-only python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "Backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]
