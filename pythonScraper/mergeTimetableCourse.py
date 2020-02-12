import json
import pathlib
import os

coursesPath = pathlib.Path(__file__).parent.parent / 'spider' / 'data' / 'courses.json'
timetablePath = pathlib.Path(__file__).parent.parent / 'spider' / 'data' / 'timetable.json'

# For removing offending characters
coursesTempPath = pathlib.Path(__file__).parent.parent / 'spider' / 'data' / 'coursesTEMP.json'
timetableTempPath = pathlib.Path(__file__).parent.parent / 'spider' / 'data' / 'timetableTEMP.json'

# Export final courses.json file
coursesUpdatedPath = pathlib.Path(__file__).parent.parent / 'spider' / 'data' / 'coursesUpdated.json'

# Nested array of [... ["from", "to"], ...]
charactersToRemove = [["”", "'"]]

# Remove unparsable characters from files
with open(coursesPath, "r", encoding="utf-8") as courses_in_file, open(timetablePath, "r", encoding="utf-8") as timetable_in_file, open(coursesTempPath, "w", encoding="utf-8") as courses_temp_out_file, open(timetableTempPath, "w", encoding="utf-8") as timetable_temp_out_file:
  
  # Replace all unwanted characters in courses.json
  for courseInLine in courses_in_file:
    try:
      for c in charactersToRemove:
        courseInLine = courseInLine.replace(c[0], c[1])
    except:
      print('courseLine', c, courseInLine)
      

    courses_temp_out_file.write(courseInLine)
  
  # Replace all unwanted characters in timetable.json
  for timetableInLine in timetable_in_file:
    for c in charactersToRemove:
      timetableInLine = timetableInLine.replace(c[0], c[1])
      
    timetable_temp_out_file.write(timetableInLine)

  # Close all files
  courses_in_file.close()
  timetable_in_file.close()
  courses_temp_out_file.close()
  timetable_temp_out_file.close()

# Process and merge files
with open(coursesTempPath, "r", encoding="utf-8") as courses_temp_in_file, open(timetableTempPath, "r", encoding="utf-8") as timetable_temp_in_file, open(coursesUpdatedPath, "w", encoding="utf-8") as courses_updated_file:
  coursesTempInJSON = json.load(courses_temp_in_file)
  timetableTempInJSON = json.load(timetable_temp_in_file)

  for c in coursesTempInJSON:
    if c['title'] != None:
      print(c['title'])

  print('-------------------------')

  for t in timetableTempInJSON['courses']:
    if c['title'] != None:
      print(c['title'])

  courses_temp_in_file.close()
  timetable_temp_in_file.close()
  courses_updated_file.close()

# # Remove Updated Files
# os.remove(coursesTempPath)
# os.remove(timetableTempPath)