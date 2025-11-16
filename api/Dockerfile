# ./api/Dockerfile
FROM python:3.14

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la API
COPY . .

# Comando para iniciar la API
CMD ["sh", "start.sh"]