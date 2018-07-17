import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { auth } from 'firebase';


@Injectable()
export class AuthService {
	private user: firebase.User;

	constructor(public afAuth: AngularFireAuth,  public db: AngularFireDatabase) {
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
	}

	getUid(): string {
		return this.user?this.user.uid:'';
	}

	getUserdata(){
		return this.db.database.ref('/userdata/' + (this.getUid() || 0));		
	}

	getUserstates() {
		return this.db.database.ref('/userdata/' + (this.getUid() || 0) + '/userstates/');
	}

	updateUserStates(userstates: string[]) {
		if (this.user){
			const userstatesRef = this.db.object('/userdata/' + this.getUid() + '/userstates');
			userstatesRef.set(userstates);
		}
    }

	signInWithEmail(credentials) {
		console.log('Sign in with email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			credentials.password);
	}

	signUp(credentials) {
		return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
	}

	get authenticated(): boolean {
		return this.user !== null;
	}

	get anonymous(): boolean {
		if (this.user){
			return this.user.isAnonymous;
		} else {
			return false;
		}
	}

	getEmail() {
		return this.user && this.user.email;
	}

	signOut(): Promise<void> {
		return this.afAuth.auth.signOut();
	}

	signInWithGoogle() {
		console.log('Sign in with google');
		return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
	}

	signInWithFB() {
		console.log('Sign in with facebook');
		return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
	}

	signInAnonymously() {
		return this.afAuth.auth.signInAnonymously();
	}

}
