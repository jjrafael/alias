//Utility for common functionalities throughtout the project
import moment from 'moment';
import { variables } from '../config';

export function getNow() {
    return moment().format(variables.timeFormat);
}