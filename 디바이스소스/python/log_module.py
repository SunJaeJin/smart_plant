import logging
from datetime import datetime

logger = logging.getLogger('my_logger')
filename = "/home/SJJ/python/log/"+str(datetime.today().date()) + ".log"
logging.basicConfig(filename=filename, level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def log_debug(msg):
    logging.debug(msg)

def log_info(msg):
    logging.info(msg)
    
def log_error(msg):
    logging.error(msg)
