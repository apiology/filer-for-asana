import { actOnInputData } from '../filer-for-asana.js';
import AlfredCli from './alfred-cli.js';
import { setCli } from '../cli.js';

setCli(new AlfredCli());
const arg = process.argv[2];
actOnInputData(arg);
