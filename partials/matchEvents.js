(function(angular) {
	'use strict';


	var MatchEventsEditor = function($interval) {
		var i;

		this.match = {
			playersHome: [],
			playersAway: []
		};

		for (i = 0; i < 16; i++) {
			this.match.playersHome.push({
				jersey: i + 1,
				name: 'Hrac '.concat(i),
				rp: '1245'.concat(i),
				points: 0
			});
		}

		for (i = 0; i < 16; i++) {
			this.match.playersAway.push({
				jersey: i + 1,
				name: 'Hrac '.concat(i),
				rp: '1245'.concat(i),
				points: 0
			});
		}

		var self = this;
		$interval(function() {
			if (self.time.running) {
				++self.time.t;
				self.timeToText();
			}
		}, 1000);

	};

	MatchEventsEditor.prototype.match = {};
	MatchEventsEditor.prototype.time = {
		minute: '00',
		second: '00',
		t: 0,
		running: false
	};
	MatchEventsEditor.prototype.nEvent = {
		time: '',
		ph: null,
		pa: null,
		e: null
	};

	MatchEventsEditor.prototype.events = [];

	MatchEventsEditor.prototype.timeToText = function() {
		var m = Math.floor(this.time.t / 60);
		if (m.toString().length > 1) {
			this.time.minute = m.toString();
		} else {
			this.time.minute = '0'.concat(m.toString());
		}

		var s = this.time.t % 60;

		if (s.toString().length > 1) {
			this.time.second = s.toString();
		} else {
			this.time.second = '0'.concat(s.toString());
		}
	};

	MatchEventsEditor.prototype.startTime = function() {
		this.time.running = true;
	};

	MatchEventsEditor.prototype.adjustTime = function(y) {
		this.time.t += y;
		this.timeToText();
	};

	MatchEventsEditor.prototype.setTime = function(y) {
		this.time.t = y;
		this.timeToText();
	};

	MatchEventsEditor.prototype.pauseTime = function() {
		this.time.running = false;
	};

	MatchEventsEditor.prototype.setPlayerH = function(num) {
		this.nEvent.time = this.time.minute + ':' + this.time.second;
		this.nEvent.ph = ++num;
		this.nEvent.pa = null;
		this.nEvent.e = null;
	};

	MatchEventsEditor.prototype.setPlayerA = function(num) {
		this.nEvent.time = this.time.minute + ':' + this.time.second;
		this.nEvent.pa = ++num;
		this.nEvent.ph = null;
		this.nEvent.e = null;
	};

	MatchEventsEditor.prototype.setE = function(e) {
		this.nEvent.e = e;
		this.applyE();
	};

	MatchEventsEditor.prototype.applyE = function() {
		this.nEvent.time = this.time.minute + ':' + this.time.second;
		this.events.unshift(this.nEvent);
		this.nEvent = {
			time: '',
			ph: null,
			pa: null,
			e: null
		};

		this.recalculate();

		document.getElementById('firstInput').focus();
	};

	MatchEventsEditor.prototype.removeE = function(idx) {
		this.events.splice(idx, 1);
	};

	MatchEventsEditor.prototype.insertE = function(idx) {
		this.events.splice(idx, 0, {
			time: '',
			ph: null,
			pa: null,
			e: null
		});
	};

	MatchEventsEditor.prototype.recalculate = function() {
		var i = 0;
		var e = null;
		var pi = null;
		var c = 0;

		for (i = 0; i < this.match.playersHome.length; i++) {
			this.match.playersHome[i].events = '';
			this.match.playersHome[i].points = 0;
			this.match.playersHome[i].punishments = '';
		}

		for (i = this.events.length - 1; i > -1; i--) {
			e = this.events[i];

			pi = parseInt(e.ph);
			if (this.match.playersHome[pi] !== undefined) {
				if (e.e === 'G') {
					this.match.playersHome[pi].events += (++c) + ';';
					this.match.playersHome[pi].points += 1;
				} else if (e.e === '7') {
					this.match.playersHome[pi].events += '[' + (++c) + '];';
					this.match.playersHome[pi].points += 1;
				} else if (e.e === '0') {
					this.match.playersHome[pi].events += '\u277C' + ';';
				} else if (e.e === 'N') {
					this.match.playersHome[pi].punishments += 'N';
				} else if (e.e === '2') {
					this.match.playersHome[pi].punishments += '2';
				} else if (e.e === 'D') {
					this.match.playersHome[pi].punishments += 'D';
				}
			}
		}

		c = 0;

		for (i = 0; i < this.match.playersAway.length; i++) {
			this.match.playersAway[i].events = '';
			this.match.playersAway[i].points = 0;
			this.match.playersAway[i].punishments = '';
		}

		for (i = this.events.length - 1; i > -1; i--) {
			e = this.events[i];

			pi = parseInt(e.pa);
			if (this.match.playersAway[pi] !== undefined) {
				if (e.e === 'G') {
					this.match.playersAway[pi].events += (++c) + ';';
					this.match.playersAway[pi].points += 1;
				} else if (e.e === '7') {
					this.match.playersAway[pi].events += '[' + (++c) + '];';
					this.match.playersAway[pi].points += 1;
				} else if (e.e === '0') {
					this.match.playersAway[pi].events += '\u277C' + ';';
				} else if (e.e === 'N') {
					this.match.playersAway[pi].punishments += 'N';
				} else if (e.e === '2') {
					this.match.playersAway[pi].punishments += '2';
				} else if (e.e === 'D') {
					this.match.playersAway[pi].punishments += 'D';
				}
			}
		}
	};

	angular.module('match-events', [])
	.controller('match-events-editor', ['$interval', MatchEventsEditor]);
}(window.angular));
