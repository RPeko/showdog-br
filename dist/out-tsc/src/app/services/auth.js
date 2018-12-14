"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth_1 = require("angularfire2/auth");
var database_1 = require("angularfire2/database");
var firebase_1 = require("firebase");
var AuthService = /** @class */ (function () {
    function AuthService(afAuth, db) {
        var _this = this;
        this.afAuth = afAuth;
        this.db = db;
        afAuth.authState.subscribe(function (user) {
            _this.user = user;
        });
    }
    AuthService.prototype.getUid = function () {
        return this.user ? this.user.uid : '';
    };
    AuthService.prototype.getUserdata = function () {
        return this.db.database.ref('/userdata/' + (this.getUid() || 0));
    };
    AuthService.prototype.getUserCountries = function () {
        return this.db.database.ref('/userdata/' + (this.getUid() || 0) + '/usercountries/');
    };
    AuthService.prototype.updateUserCountries = function (usercountries) {
        if (this.user) {
            var usercountriesRef = this.db.object('/userdata/' + this.getUid() + '/usercountries');
            usercountriesRef.set(usercountries);
        }
    };
    AuthService.prototype.signInWithEmail = function (credentials) {
        console.log('Sign in with email');
        return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
    };
    AuthService.prototype.signUp = function (credentials) {
        return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    };
    Object.defineProperty(AuthService.prototype, "authenticated", {
        get: function () {
            return this.user !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "anonymous", {
        get: function () {
            if (this.user) {
                return this.user.isAnonymous;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    AuthService.prototype.getEmail = function () {
        return this.user && this.user.email;
    };
    AuthService.prototype.signOut = function () {
        return this.afAuth.auth.signOut();
    };
    AuthService.prototype.signInWithGoogle = function () {
        console.log('Sign in with google');
        return this.afAuth.auth.signInWithPopup(new firebase_1.auth.GoogleAuthProvider());
    };
    AuthService.prototype.signInWithFB = function () {
        console.log('Sign in with facebook');
        return this.afAuth.auth.signInWithPopup(new firebase_1.auth.FacebookAuthProvider());
    };
    AuthService.prototype.signInAnonymously = function () {
        return this.afAuth.auth.signInAnonymously();
    };
    AuthService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [auth_1.AngularFireAuth, database_1.AngularFireDatabase])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.js.map