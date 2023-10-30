import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const client = new PrismaClient({
    // datasourceUrl : "postgresql://xfhkpqiutg123:U83fdf781bcd8e59a1887aee2ff64e1f@annotext.postgres.database.azure.com:5432/annotext"
});

client.annotation.findMany({
    where : { value : {not : null as any }},
    select : {value : true}
 }).then(data => {
    if(data[0])
        console.log((data[0].value as any)['hateful']);
 })