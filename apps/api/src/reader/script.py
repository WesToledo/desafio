import json
import sys
import csv
import dateutil.parser
import os

def parse_date_to_iso(date_str):
    return dateutil.parser.parse(date_str,).isoformat()

def parse_date(date_str):
    return dateutil.parser.parse(date_str)

def transform_row(row):
    
    init_date = ""
    updated_date = ""
    
    init_date = parse_date(row[2])
    updated_date = parse_date(row[4])
    
    # update menor que inicio 
    if(updated_date < init_date):
        init_date = dateutil.parser.parse(row[2], dayfirst=True)
    
        # update continua menor que inicio 
        if(updated_date < init_date):
            updated_date = dateutil.parser.parse(row[4], dayfirst=True)
            init_date = parse_date(row[2])
            
    try:
        row[5] = parse_date_to_iso(row[5])
    except:
        row[5] = 'null'
    row[7] = parse_date_to_iso(row[7])
    
    row_dict = {
        "billAmount": row[0],
        "billInterval": row[1],
        "dateInit": init_date.isoformat(),
        "status": row[3],
        "statusUpdateDate": updated_date.isoformat(),
        "cancelDate": row[5],
        "value": row[6],
        "nextCicle": row[7],
        "code": row[8]
    }
    
    return row_dict



def read_data_sheet(file_names):
    rows = []
    for file_name in file_names:
        with open(f"./src/arquives/{file_name}") as file_obj: 
            reader_obj = csv.reader(file_obj) 
            next(reader_obj) # skip header
            for row in reader_obj: 
                try:
                    rows.append(transform_row(row))
                except:
                    pass
        os.remove(f"./src/arquives/{file_name}")
    return rows

if __name__ == "__main__":
    # recebe os nomes dos arquivos recebidos do cliente enviados pelo PythonShell
    file_names = json.loads(sys.argv[1])
    data_array = read_data_sheet(file_names)
    
    
    print(json.dumps(data_array))