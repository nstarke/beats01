var Beats01 = function() {
	this.audiolet = new Audiolet();
	var MainSounds = function() {
		this.tomHBuffer = new AudioletBuffer(1, 0);
		this.tomLBuffer = new AudioletBuffer(2, 0, false);
		this.tomMBuffer = new AudioletBuffer(2, 0, false);
		this.rimshotBuffer = new AudioletBuffer(1, 0);
		this.hoover1 = new AudioletBuffer(1,0);
		this.rimshotBuffer.load('samples/808/Rimshot.wav', false);
		this.tomHBuffer.load('samples/drumkit1/Hat046.wav', false);
		this.tomLBuffer.load('samples/drumkit1/Snare159.wav');
		this.tomMBuffer.load('samples/drumkit1/Junk04.wav')
		this.hoover1.load('samples/drumkit1/Junk06.wav', false);
	}
	var AuxSounds1 = function() {
		this.bassDrumBuffer = new AudioletBuffer(1, 0);
		this.snareDrumBuffer = new AudioletBuffer(1, 0);
		this.highHatDrumBuffer = new AudioletBuffer(1, 0);
		this.hhClosedBuffer = new AudioletBuffer(2, 0);
		//this.hoover2 = new AudioletBuffer(1,0);
		this.bassDrumBuffer.load('samples/808/Bassdrum-01.wav', false);
		this.snareDrumBuffer.load('samples/808/Snaredrum.wav', false);
		this.highHatDrumBuffer.load('samples/808/HatClosed.wav', false);
		this.hhClosedBuffer.load('samples/808/HatOpen.wav', false);
		//this.hoover2.load('samples/hooverz/Always.wav', false);
	}
	var AuxSounds2 = function() {
		this.cabasaBuffer = new AudioletBuffer(1, 0);
		this.clapBuffer = new AudioletBuffer(1, 0);
		this.clavesBuffer = new AudioletBuffer(1, 0);
		this.cowbellBuffer = new AudioletBuffer(1, 0);
		this.crash1Buffer = new AudioletBuffer(2, 0, false);
		this.crash2Buffer = new AudioletBuffer(2, 0, false);
		this.hoover3 = new AudioletBuffer(1,0);
		this.cabasaBuffer.load('samples/808/Cabasa.wav', false);
		this.clapBuffer.load('samples/808/Clap.wav', false);
		this.clavesBuffer.load('samples/808/Claves.wav', false);
		this.crash1Buffer.load('samples/drumkit1/Hat047.wav');
		this.crash2Buffer.load('samples/drumkit1/Hat048.wav');
		this.cowbellBuffer.load('samples/808/Cowbell.wav', false);
		this.hoover3.load('samples/drumkit1/Snare160.wav', false);
	}
	var BufferGroup = function(audiolet, buffer) {
		AudioletGroup.call(this, audiolet, 0, 1);
		this.trig = new TriggerControl(audiolet);
		this.bp = new BufferPlayer(audiolet, buffer, 1, 0, 0);
		this.trig.connect(this.bp, 0, 1);
		this.bp.connect(this.outputs[0]);
	}
	extend(BufferGroup, AudioletGroup);
	var SampleGroup = function (audiolet, group){
		this.sample = [];
		for (sound in group){
			var bg = new BufferGroup(audiolet, group[sound])
			//bg.connect(audiolet.output);
			this.sample.push(bg);
		}
	}
	this.samples = {};
	this.samples.main = new SampleGroup(this.audiolet, new MainSounds());
	this.samples.aux1 = new SampleGroup(this.audiolet, new AuxSounds1());
	this.samples.aux2 = new SampleGroup(this.audiolet, new AuxSounds2());
	this.mainPattern = new PChoose(this.samples.main.sample, Infinity);
	this.aux1Pattern = new PSequence(this.samples.aux1.sample, Infinity);
	this.aux2Pattern = new PSequence(this.samples.aux2.sample, Infinity);
	this.durationPattern1 = new PSequence([new PSequence([4, 1, 1, 2, 2, 2]), new PSequence([2, 2 / 3, 1, 3]), new PSequence([1, 1, 1, 1, 3, 3]), new PSequence([8, 2, 2 / 3, 4, 1, 1]), new PSequence([4, 4, 2, 6, 2, 2 / 3]), new PSequence([3, 1, 3, 1, 3, 1])], Infinity);
	this.durationPattern2 = new PSequence([new PSequence([4, 1, 1, 2 / 3]), new PSequence([2, 2 / 3, 1]), new PSequence([1, 1, 1, 1]), new PSequence([8, 2 / 3]), new PSequence([4, 4, 2 / 3, 6]), new PSequence([3, 1, 3])], Infinity);
	this.durationPattern3 = new PChoose([new PSequence([4, 1, 1, 2, 2, 2]), new PSequence([2, 2 / 3, 1, 3]), new PSequence([1, 1, 1, 1, 3, 3]), new PSequence([8, 2, 2 / 3, 4, 1, 1]), new PSequence([4, 4, 2, 6, 2, 2 / 3]), new PSequence([3, 1, 3, 1, 3, 1])], Infinity);
	this.ratePattern1 = new PChoose([1, 1, Math.random() * 3, Math.random * 3, Math.random * 3], Infinity);
	this.ratePattern2 = new PChoose([1, 1, 0.5, 0.5, Math.random() * 4, Math.random * 4, Math.random * 4], Infinity);
	this.ratePattern3 = new PChoose([1, 1, 0.5, 0.5, 1.5, 2, Math.random() * 6, Math.random * 3, Math.random * 6], Infinity);
	this.audiolet.scheduler.setTempo(325);
	this.audiolet.scheduler.play([this.mainPattern, this.ratePattern1], this.durationPattern1, function(sample, rate) {
		sample.bp.disconnect(sample.audiolet.output);
		sample.bp.position = 0;
		sample.bp.playing = true;
		sample.bp.connect(sample.audiolet.output);
		
		sample.trig.trigger.setValue(1);
		
		if (!isNaN(rate)){
		sample.bp.playbackRate.setValue(rate);
	}
		
		//buffer.trigger.trigger.setValue(1);
		//buffer.player.connect(buffers.audiolet.output);
	}.bind(this));
        this.audiolet.scheduler.play([this.aux1Pattern, this.ratePattern2], this.durationPattern3, function(sample, rate) {
        	sample.bp.disconnect(sample.audiolet.output);
		sample.bp.position = 0;
		sample.bp.playing = true;
		sample.bp.connect(sample.audiolet.output);
		sample.trig.trigger.setValue(1);
		if (!isNaN(rate)){
		sample.bp.playbackRate.setValue(rate);
		}
		//sample.bp.connect(this.audiolet.output);
		//buffer.player.connect(buffers.audiolet.output);
	}.bind(this));
	this.audiolet.scheduler.play([this.aux2Pattern, this.ratePattern3], this.durationPattern2, function(sample, rate) {
		sample.bp.disconnect(sample.audiolet.output);
		sample.bp.position = 0;
		sample.bp.playing = true;
		sample.bp.connect(sample.audiolet.output);
		sample.trig.trigger.setValue(1);
		if (!isNaN(rate)){
		sample.bp.playbackRate.setValue(rate);
		}
		//sample.bp.connect(this.audiolet.output);
		//buffer.player.connect(buffers.audiolet.output);
	}.bind(this));
	//buffers.audiolet.connect(this.audiolet.output);
	
}