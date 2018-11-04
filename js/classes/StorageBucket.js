window.terafm = window.terafm || {};

terafm.StorageBucket = class Bucket {
	constructor(domainId, setObj) {
		this.domainId = domainId;

		this.context = {
			[this.domainId]: {
				fields: {} 
			}
		};

		if(setObj) this.set(setObj)
	}

	get fields() {
		return this.context[this.domainId].fields;
	}

	get sessionIds() {
		return this._sessionIds !== undefined ? this._sessionIds : this._sessionIds = this.generateSessionIds();
	}

	empty() {
		this.context[this.domainId].fields = {};
	}

	del(sid, eid) {
		if(this.fields.hasOwnProperty(eid) && this.fields[eid].sess.hasOwnProperty(sid)) {
			delete this.fields[eid].sess[sid];
			if(Object.keys(this.fields[eid].sess).length === 0) {
				delete this.fields[eid];
			}
			console.log('found to delete!')
		}
	}

	set(obj) {
		let objk = Object.keys(obj);

		// Create bucket from data read from storage (storage.local.get)
		if(objk.length === 1 && objk[0].indexOf('###') === 0) {
			this.context = obj;
		} else {
			this.setFieldObj(obj);
		}
	}

	// Used when migrating from IndexedDB
	setFieldObj(fieldsObj) {
		this.context[this.domainId].fields = fieldsObj;
	}

	generateSessionIds() {
		let ids = [];
		for(let fid in this.fields) {
			ids = ids.concat(Object.keys(this.fields[fid].sess));
		}
		return ids.sort();
	}

	setEntry(entry) {
		if(!(entry instanceof terafm.Entry)) throw new Error();

		// Editable is not already in bucket, create it
		if(!this.fields.hasOwnProperty(entry.editableId)) {
			this.fields[entry.editableId] = {
				meta: entry.meta,
				sess: {}
			};
		}
		
		// Append entry to editable in bucket
		this.fields[entry.editableId].sess[entry.sessionId] = { value: entry.value };
	}

	copy() {
		return JSON.parse(JSON.stringify(this));
	}

	getEntries(max=-1, excludeEid, filterFn) {
		let allsess = this.getSessions();
		let entrylist = new terafm.EntryList();

		allsess.each(sess => {
			sess.each(entry => {
				if(max !== undefined && max > 0) max--; else if(max !== undefined) return false;
				if(excludeEid && entry.editableId === excludeEid) return null;
				if(filterFn && filterFn(entry) === false) return false;
				entrylist.set(entry);
			})
			if(max !== undefined && max < 1) return false;
		});

		return entrylist;
	}

	getSessions(_sids=[], max=-1) {
		let sids = _sids && _sids.length ? _sids : this.sessionIds.reverse();
		let sesslist = new terafm.SessionList();

		for(let sid of sids) {
			let tmpsess = new terafm.Session(sid);

			for(let fid in this.fields) {
				if(this.fields[fid].sess.hasOwnProperty(sid)) {
					tmpsess.push(new terafm.Entry({
						session: tmpsess,
						sessionId: sid,
						editableId: fid,
						value: this.fields[fid].sess[sid].value,
						meta: this.fields[fid].meta,
					}));
				}
			}

			if(tmpsess.length) {
				sesslist.push(tmpsess);
				if(max === 0) break; else max--;
			}
		}

		return sesslist;
	}
	
	getSessionsContainingEditable(eid, max) {
		if(this.fields.hasOwnProperty(eid) !== true) return new terafm.SessionList();
		const sids = Object.keys(this.fields[eid].sess).reverse();
		return this.getSessions(sids, max);
	}


	getSession(sid) {
		let sess = new terafm.Session(sid);

		for(let eid in this.fields) {
			if(this.fields[eid].sess.hasOwnProperty(sid)) {
				sess.push(
					new terafm.Entry({
						session: sess,
						sessionId: sid,
						editableId: eid,
						value: this.fields[eid].sess[sid].value,
						meta: this.fields[eid].meta
					})
				);
			}
		}

		return sess;
	}
	getEntry(sid, eid) {
		if(this.fields.hasOwnProperty(eid) && this.fields[eid].sess.hasOwnProperty(sid)) {
			return new terafm.Entry({
				session: null,
				sessionId: sid,
				editableId: eid,
				value: this.fields[eid].sess[sid].value,
				meta: this.fields[eid].meta
			});;
		}
	}
}