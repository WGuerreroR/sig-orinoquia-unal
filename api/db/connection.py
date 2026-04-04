from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import configparser
from urllib.parse import quote_plus

# Leer config.ini
config = configparser.ConfigParser()
config.read("config.ini")

db_config = config["database"]

# Manejo de password con caracteres especiales
password = quote_plus(db_config["password"])

DATABASE_URL = (
    f"postgresql+psycopg2://{db_config['user']}:{password}"
    f"@{db_config['host']}:{db_config['port']}/{db_config['name']}"
)

# Crear engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# Crear sesión
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()

# Dependency para FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()