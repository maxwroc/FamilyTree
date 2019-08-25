module FamilyTreePlotter {

    export class Path {
        public path = "";
        private currentPos = {
            x: 0,
            y: 0
        }
        constructor(x: number, y: number) {
            this.setCurrentPos(x, y, false);
            this.path += `M ${x} ${y}`;
        }

        public lineTo(x: number | null, y: number | null, isRelative = true) {
            this.setCurrentPos(x, y, isRelative);
            this.path += `L ${this.currentPos.x} ${this.currentPos.y}`;
            return this;
        }

        public arcTo(x: number | null, y: number | null, rx: number, ry: number, isRelative = true) {
            this.setCurrentPos(x, y, isRelative);
            this.path += `A ${rx} ${ry} 0 0 1 ${this.currentPos.x} ${this.currentPos.y}`;
            return this;
        }

        private setCurrentPos(toX: number | null, toY: number | null, isRelative = true) {
            if (toX == null) {
                toX = this.currentPos.x;
            }

            if (toY == null) {
                toY = this.currentPos.y;
            }

            if (isRelative) {
                this.currentPos.x += toX;
                this.currentPos.y += toY;
            }
            else {
                this.currentPos.x = toX;
                this.currentPos.y = toY;
            }
        }

        getPath() {
            return this.path;
        }
    }

}