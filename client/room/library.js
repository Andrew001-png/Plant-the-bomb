import * as Room from 'pixel_combats/room';
import * as Basic from 'pixel_combats/basic';

export function CreateTeam(tag, name, color, spawnpoint) {
    Room.Teams.Add(tag, `<i><B><size=36>${name.name[0]}</size><size=27>${name.name.slice(1)}</size></i>\n${name.undername}</i>`,color);

    let team = Room.Teams.Get(tag);
    team.Spawns.SpawnPointsGroups.Add(spawnpoint);
    return team;
};













