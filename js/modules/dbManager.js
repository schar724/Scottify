import songs from '../sample-songs.json' assert { type : 'json'};

const songArray = songs;

export function getSongs(){
    return songArray;
}