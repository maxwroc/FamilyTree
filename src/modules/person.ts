module FamilyTreePlotter {

    export enum Relation {
        Partner,
        Parent,
        Child,
        Sibling
    }

    export enum Sex {
        Male = "m",
        Female = "f"
    }

    export class Person {

        public id: number;

        public relatives = {
            children: [],
            spouses: []
        } as { mother?: Person, father?: Person, spouses: Person[], children: Person[] };

        constructor(public data: IPersonData) {
            this.id = data.id;
        }

        public setRelatives(people: IInitializedPeople, relationships: IRelationshipMap) {
            if (this.data.father) {
                this.relatives.father = people[this.data.father];
                this.relatives.father.relatives.children.push(this);
            }

            if (this.data.mother) {
                this.relatives.mother =  people[this.data.mother];
                this.relatives.mother.relatives.children.push(this);
            }

            let myRelationships = relationships[this.id];
            if (myRelationships && myRelationships.length) {
                // sort
                myRelationships.sort((a, b) => {
                    if (a.type == b.type) {
                        // take the add order as a last sort factor
                        return b.id - a.id;
                    }

                    return a.type == "marriage" ? 1 : 0;
                });

                myRelationships.forEach(r => {
                    this.relatives.spouses.push(r.p1 == this.id ? people[r.p2] : people[r.p1]);
                });
            }
        }
     }
}