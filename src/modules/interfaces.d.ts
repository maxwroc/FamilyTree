
interface IRelative {
    person: FamilyTreePlotter.Person,
    relation: FamilyTreePlotter.Relation
}

interface IPersonData {
    id: number,
    fname?: string,
    sname?: string,
    sex: "m" | "f",
    mother?: number,
    father?: number
}

interface IInitializedPeople {
    [id: number]: FamilyTreePlotter.Person
}

interface IRelationshipData {
    id: number,
    p1: number,
    p2: number,
    type: "marriage" | "ex",
    startDate?: string,
    endDate?: string
}

interface IRelationshipMap {
    [personId: number]: IRelationshipData[]
}