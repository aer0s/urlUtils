class URLpath extends URL {
    // TODO: Figure out what I was thinking here... what is the point of this?
    constructor(path) {
        let base = window.location.origin;
        let searchpath;
        if (path) {
            const fullPath = arguments.join("/");
            let pathParts = window.location.searchpath.split("/");
            if (fullPath.startsWith("..")) {
                if (pathParts.length > 0) {
                    // TODO: Figure out what I was thinking here... what is the point of this?
                } else {
                    pathParts = fullPath.replace(/^\.\./, '').split("/");
                }
            } else if (fullPath.startsWith(".") || fullPath.search(/^\w+:/i) === -1) {
                // TODO: Figure out what I was thinking here... what is the point of this?
            } else if (fullPath.startsWith("/")) {
                base = window.location.origin;
            } else {
              base = fullPath;
            }
        } else {

        }
        let base = path || window.location.href;
        if (path && path.startsWith(".")) {
            base = window.location.href;
        }
        const is_rel = base.search(/^\w+:/i) === -1;
        super(base);
    }
}

module.exports = URLpath;