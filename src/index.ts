
module FamilyTreePlotter {

    let peopleData: IPersonData[] = [
        { id: 1, fname: "Max", sname: "Wroc", mother: 2, father: 3, sex: "m" },
        { id: 2, fname: "Halina", sname: "Wroc", sex: "f" },
        { id: 3, fname: "Norbert", sname: "Wroc", sex: "m" },
        { id: 4, fname: "Amadeusz", sname: "Wroc", mother: 6, father: 1, sex: "m" },
        { id: 5, fname: "Artur", sname: "Wroc", mother: 6, father: 1, sex: "m" },
        { id: 6, fname: "Magdalena", sname: "Wroc", sex: "f" },
    ];

    let relationshipData: IRelationshipData[] = [
        { id: 1, p1: 1, p2: 6, type: "marriage" },
        { id: 2, p1: 2, p2: 3, type: "ex" }
    ];

    window.addEventListener("load", () => {

        // convert db to (Person.id => Person) map
        let people = peopleData.reduce((acc, curr) => { acc[curr.id] = new Person(curr); return acc; }, {} as IInitializedPeople);

        // convert relationships to (Person.id => IRelationshipData[]) map
        let relationships = relationshipData.reduce((acc, curr) => {
            acc[curr.p1] = acc[curr.p1] || [];
            acc[curr.p1].push(curr);

            acc[curr.p2] = acc[curr.p2] || [];
            acc[curr.p2].push(curr);
            return acc;
        }, {} as IRelationshipMap);

        // set relatives for everyone
        Object.keys(people).forEach(id => people[parseInt(id)].setRelatives(people, relationships));

        let mainPersonId = 1;
        let painter = new Painter(new Canvas("body"), people);
        painter.drawTree(people[mainPersonId]);
    });


}