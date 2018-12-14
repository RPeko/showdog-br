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
var database_1 = require("angularfire2/database");
var ShowProvider = /** @class */ (function () {
    function ShowProvider(db) {
        this.db = db;
        this.showRef = db.database.ref('/shows/');
        this.showLevels = db.list('/showlevel').valueChanges();
        this.countries = db.list('/countries', function (ref) { return ref.orderByChild('name'); }).valueChanges();
    }
    ShowProvider.prototype.upsertShow = function (show) {
        if (!show.key || show.key === '' || show.key === 'undefined') {
            show.key = this.showRef.push().key;
        }
        var showObj = this.db.object('/shows/' + show.key);
        return showObj.update(show);
    };
    ShowProvider = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [database_1.AngularFireDatabase])
    ], ShowProvider);
    return ShowProvider;
}());
exports.ShowProvider = ShowProvider;
//# sourceMappingURL=show.provider.js.map