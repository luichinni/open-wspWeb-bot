const hashFunction = (s) => {
    var hash = 0;

    for (i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash = hash & hash; // prevent overflow from happening
    }
    return (hash & 0xffff).toString(16);   // returns lower 16-bit of hash value
};

module.exports = hashFunction;