/// <reference path="../../../../typings/index.d.ts" />

import * as Chalk from 'chalk';

import Action from './Action';
import {Environment} from '../../chook';
import {ServerManager} from '../../net';

class Server extends Action{

	args: {
		action: string;
		attached: boolean;
		quiet: boolean;
		gui: boolean;
	};

	constructor(){
		super();
		this.actions = [ "start", "stop", "status" ];
	}

	run(): void{
		super.run();
		this.args = Environment.get( 'args' );
		if( this.args[ 'action' ] == 'start' ){
			this.startServer();
		}else if( this.args[ 'action' ] == 'stop' ){
			this.stopServer();
		}else if( this.args[ 'action' ] == 'status' ){
			this.getServerStatus();
		}
	}

	startServer(): void{
		let serverManager: ServerManager = new ServerManager();
		if( this.args.attached ){
			serverManager.initialize();
			serverManager.start();
		}else{
			serverManager.startDetached();
		}
	}

	stopServer(): void{
		let serverManager: ServerManager = new ServerManager();
		serverManager.stop();
	}

	getServerStatus(): void{
		let serverManager: ServerManager = new ServerManager();
		serverManager
			.isOnline()
			.then( ( online: boolean ) => {
				if( !online ){
					console.log( Chalk.red( `The server is not online.` ) );
				}else{
					console.log( Chalk.green( `The server is online.` ) );
				}
			});
	}

}

const server: Server = new Server();
export default server;