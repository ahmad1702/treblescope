from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# Create Chrome options to run in headless mode
chrome_options = Options()
chrome_options.add_argument("chrome=111.0.5563.146")
# chrome_options.add_argument("--headless")

# Create a new Chrome driver instance with options
driver = webdriver.Chrome(options=chrome_options)

# Navigate to Wikipedia
driver.get("https://en.wikipedia.org/")

search_box = driver.find_element_by_css_selector("input[name=search]")

if not search_box:
    raise Exception("Search Box could not be reached on initial page load")
