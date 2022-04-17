print('===============JAVASCRIPT===============');
print('Count of rows in sample collection: ' + db.sample.count());

db.sample.insert({ myfield: 'test1', anotherfield: 'TEST1' });
db.sample.insert({ myfield: 'test2', anotherfield: 'TEST2' });

print('===============AFTER JS INSERT==========');
print('Count of rows in sample collection: ' + db.sample.count());

alltest = db.sample.find();
while (alltest.hasNext()) {
  printjson(alltest.next());
}