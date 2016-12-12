/// <reference path="../../../typings/index.d.ts" />

import Actor from './Actor';
import {Access, AccessInterface, Database} from '../data';
import * as Sequelize from 'sequelize';

const model = Database.models.task;

interface TaskData{
	command?: string;
	working_dir?: string;
	description?: string;
	after?: number;
	entry_id: number;
}

class Task extends Actor<Task>{

	$position?: number;

	static find: AccessInterface<Task>;

	constructor( data: TaskData ){
		super( model, data );
		this.hidden = [
			"after",
			"entry_id",
			"updated_at"
		];
	}

}

Task.find = ( new Access( Task, model ) ).getInterface();

export default Task;