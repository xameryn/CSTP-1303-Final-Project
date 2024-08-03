function ArenaObject(element) {
    this.element = element;
}

ArenaObject.prototype.update = function() {
    // Arena objects do not need gravity or other physics applied
};

export { ArenaObject };
