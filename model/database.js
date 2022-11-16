Object.defineProperty(exports, "__esModule", { value: true });
exports.tally = void 0;
const fs = require("fs");
const path = require("path");
const process = require("process");
const http = require("http");
const yaml = require("js-yaml");

class _tally {
    constructor() {
        this.lstTableMaster = [];
        try {
            this.config = {
                server: 'localhost',
                port: 9000,
                company: '',
                fromdate: 'auto',
                todate: 'auto',
                sync: 'full'
            };
            let objYAML = yaml.load(fs.readFileSync('./tally.yaml', 'utf-8'));
            this.lstTableMaster = objYAML['master'];
        }
        catch (err) {
            this.config = {
                server: 'localhost',
                port: 9000,
                company: '',
                fromdate: 'auto',
                todate: 'auto',
                sync: 'full'
            };
            throw err;
        }
    }

importData() {
    return new Promise(async (resolve, reject) => {
        try {
                let lstTables = [];
                lstTables.push(...this.lstTableMaster);
                    //update active company information before starting import
                    await this.saveCompanyInfo();
                
               
                //prepare substitution list of runtime values to reflected in TDL XML
                let configTallyXML = new Map();
                configTallyXML.set('fromDate', this.config.fromdate);
                configTallyXML.set('toDate', this.config.todate);
                configTallyXML.set('targetCompany', '##SVCurrentCompany');
                        await database_js_1.database.truncateTables(lstTables.map(p => p.name)); //truncate tables
                //delete and re-create CSV folder
                if (fs.existsSync('./csv'))
                    fs.rmSync('./csv', { recursive: true });
                fs.mkdirSync('./csv');
                //dump data exported from Tally to CSV file required for bulk import
                for (let i = 0; i < lstTables.length; i++) {
                    let timestampBegin = Date.now();
                    let targetTable = lstTables[i].name;
                    await this.processReport(targetTable, lstTables[i], configTallyXML);
                    let timestampEnd = Date.now();
                    let elapsedSecond = utility_js_1.utility.Number.round((timestampEnd - timestampBegin) / 1000, 3);
                    logger_js_1.logger.logMessage('  saving file %s.csv [%f sec]', targetTable, elapsedSecond);
                }
                    //perform CSV file based bulk import into database
                    logger_js_1.logger.logMessage('Loading CSV files to database tables [%s]', new Date().toLocaleString());
                    for (let i = 0; i < lstTables.length; i++) {
                        let targetTable = lstTables[i].name;
                        let rowCount = await database_js_1.database.bulkLoad(path.join(process.cwd(), `./csv/${targetTable}.data`), targetTable, lstTables[i].fields.map(p => p.type));
                        fs.unlinkSync(path.join(process.cwd(), `./csv/${targetTable}.data`)); //delete raw file
                        logger_js_1.logger.logMessage('  %s: imported %d rows', targetTable, rowCount);
                    }
                    fs.rmdirSync('./csv'); //remove directory
             
               
            
            resolve();
        }
        catch (err) {
            logger_js_1.logger.logError('tally.processMasters()', err);
            reject(err);
        }
    });
}
}

let tally = new _tally();
exports.tally = tally;