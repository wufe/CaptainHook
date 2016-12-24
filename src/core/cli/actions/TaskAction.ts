import Action from './Action';

import {Task} from '../../actors';
import {EntryManager, EntryModel, Environment, getEnvironment, Log, TaskManager, Utils} from '../../chook';

import {createInterface, ReadLine} from 'readline';

import {green, red} from 'chalk';

interface TaskArgs{
	action: string;
	taskAction: string;
	entry_id?: string | number;
	task_id?: number;
	after?: number;
	environment?: string[];
}

class TaskAction extends Action{

	args: TaskArgs;
	environment: Environment;

	constructor(){
		super();
		this.environment = getEnvironment();
		this.actions = [ "task", "t" ];
	}

	run(){
		super.run();
		this.args = this.environment.get( 'args' );
		if( [ "add", "a", "create", "c" ].indexOf( this.args[ 'taskAction' ] ) > -1 ){
			this.addTask();
		}else if( [ "delete", "del", "d" ].indexOf( this.args[ 'taskAction' ] ) > -1 ){
			this.deleteTask();
		}
	}

	addTask(): void{
		let entryManager: EntryManager = new EntryManager();
		let {entry_id} = this.args;
		entryManager
			.loadEntries()
			.then( () => {
				let foundEntryModel: EntryModel = entryManager.findById( <number>entry_id );
				if( !foundEntryModel )
					foundEntryModel = entryManager.findByName( `${entry_id}` );
				if( !foundEntryModel )
					throw new Error( `Cannot find entry with id ${entry_id}.` );
				this.addTaskToEntryModel( foundEntryModel );
			})
			.catch( ( error: any ) => {
				Log( "error", red( error.message ) );
			});
	}

	addTaskToEntryModel( entryModel: EntryModel ): void{
		let readline: ReadLine = this.getReadlineInterface();
		readline.question( `$ `, ( command: string ) => {
			readline.question( `Working directory (leave blank for inherit): `, ( working_dir: string ) => {
				readline.question( `Description: `, ( description: string ) => {
					readline.question( `Place it after task id (leave blank for default): `, ( afterString: string ) => {
						let after: number = null;
						if( afterString )
							after = parseInt( afterString );
						let taskManager: TaskManager = new TaskManager( entryModel );
						let {environment: env} = this.args;
						taskManager.createTask({
							command,
							working_dir,
							description,
							entry_id: entryModel.getId(),
							after,
							env
						})
						.then( () => {
							console.log( green( `Command saved.` ) );
						})
						.catch( ( error: any ) => {
							Log( "error", red( error.message ) );
						});
						readline.close();
					});
				});
			});
		});
	}

	getReadlineInterface() : ReadLine{
		let readline: ReadLine = createInterface({
			input: process.stdin,
			output: process.stdout
		});
		return readline;
	}

	deleteTask(): void{
		let entryManager: EntryManager = new EntryManager();
		let {task_id} = this.args;
		Task
			.find
			.byId( task_id )
			.then( ( task: Task ) => {
				task.delete();
				console.log( green( `Command deleted.` ) );
			})
			.catch( ( error: any ) => {
				Log( "error", red( error.message ), error );
			});
	}
}

const taskAction: TaskAction = new TaskAction();
export default taskAction;