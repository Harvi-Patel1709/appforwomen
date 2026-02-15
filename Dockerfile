# Eraya - Period Wellness App
# Build: docker build -t eraya .
# Run:   docker run -p 8080:8080 eraya
# Deploy to Cloud Run: gcloud run deploy eraya --source .

FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["gunicorn", "-b", "0.0.0.0:8080", "main:app"]
