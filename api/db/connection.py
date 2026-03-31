from sqlalchemy import create_engine
import configparser

config = configparser.ConfigParser()
config.read("config.ini")

db_config = config["database"]

DATABASE_URL = (
    f"postgresql+psycopg2://{db_config['user']}:{db_config['password']}"
    f"@{db_config['host']}:{db_config['port']}/{db_config['name']}"
)

engine = create_engine(DATABASE_URL)