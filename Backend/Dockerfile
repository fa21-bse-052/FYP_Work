# Base image using Python 3.9
FROM python:3.9

# Install system dependencies needed by OpenCV, network utilities, and certificates.
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    iputils-ping \
    net-tools \
    curl \
    ca-certificates

# Install system dependencies (poppler-utils is required by pdf2image).
RUN apt-get update && apt-get install -y poppler-utils && rm -rf /var/lib/apt/lists/*


# Create a new user to run the app
RUN useradd -m -u 1000 user
USER user

# Set environment variables
ENV PATH="/home/user/.local/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Copy the requirements and install dependencies
COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the rest of the application
COPY --chown=user . /app

# Expose port 7860 for the application
EXPOSE 7860

# Command to run the FastAPI app using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
