import json
import csv
from datetime import datetime

blacklist = {"BUS", "EXAMPLE"}  # Set of blacklisted words
CUTOFF_YEAR = 2015

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%m/%d/%Y")
    except ValueError:
        return None

with open("./data/nyc_streetsign_data.csv", "r") as f:
    reader = csv.reader(f)
    next(reader)
    data = {"street_signs": []}
    seen_coordinates = set()  
    index = 1
    for row in reader:
        x_coord, y_coord = row[0], row[1]
        sign_description = row[13]
        order_completed_on_date = parse_date(row[11])
        if x_coord != "0" and not any(word in sign_description for word in blacklist) and \
                (x_coord, y_coord) not in seen_coordinates and order_completed_on_date and order_completed_on_date.year > CUTOFF_YEAR:
            data["street_signs"].append({
                "index": index,
                "X": x_coord,
                "Y": y_coord,
                "order_number": row[2],
                "borough": row[7],
                "on_street": row[8],
                "from_street": row[9],
                "to_street": row[10],
                "order_completed_on_date": row[11],
                "sign_code": row[12],
                "sign_description": sign_description,
            })
            seen_coordinates.add((x_coord, y_coord))
            index += 1

with open("./db.json", "w") as f:
    json.dump(data, f, indent=2)