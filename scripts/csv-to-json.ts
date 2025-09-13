import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface CsvRow {
  title: string;
  category: string;
  targetWindow: string;
  note?: string;
}

interface Task {
  id: string;
  title: string;
  category: string;
  targetWindow: string;
  note?: string;
}

function parseCsv(csvContent: string): CsvRow[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const rows: CsvRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: CsvRow = {
      title: values[0] || '',
      category: values[1] || '',
      targetWindow: values[2] || '',
      note: values[3] || undefined,
    };
    rows.push(row);
  }
  
  return rows;
}

function convertToTasks(csvRows: CsvRow[]): Task[] {
  return csvRows.map(row => {
    return {
      id: uuidv4(),
      title: row.title,
      category: row.category,
      targetWindow: row.targetWindow,
      note: row.note,
    };
  });
}

function main() {
  const csvPath = process.argv[2];
  
  if (!csvPath) {
  console.error('Usage: ts-node csv-to-json.ts <csv-file-path>');
  console.error('Example: ts-node csv-to-json.ts tasks.csv');
  console.error('Expected CSV columns: title, category, targetWindow, note (optional)');
    process.exit(1);
  }
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const csvRows = parseCsv(csvContent);
    const tasks = convertToTasks(csvRows);
    
    const outputPath = path.join(__dirname, '..', 'data', 'tasks.json');
    fs.writeFileSync(outputPath, JSON.stringify(tasks, null, 2), 'utf-8');
    
    console.log(`✅ Successfully converted ${tasks.length} tasks from CSV to JSON`);
    console.log(`📁 Output file: ${outputPath}`);
    
    // Show sample of converted data
    console.log('\n📋 Sample converted tasks:');
    tasks.slice(0, 3).forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.targetWindow})`);
    });
    
  } catch (error) {
    console.error('❌ Error converting CSV to JSON:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
