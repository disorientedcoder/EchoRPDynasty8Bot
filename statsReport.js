var dbCmds = require('./dbCmds.js');
var editEmbed = require('./editEmbed.js');
var { EmbedBuilder } = require('discord.js');

module.exports.statsReport = async (client) => {
	var lastRep = await dbCmds.readRepDate("lastRealtorStatsReportDate");
	var now = Math.floor(new Date().getTime() / 1000.0);
	var today = `<t:${now}:d>`;

	var statsArray = await dbCmds.monthlyStatsRep();
	var statsDescList = '';

	for (i = 0; i < statsArray.length; i++) {
		statsDescList = statsDescList.concat(`__${statsArray[i].charName}__:
• **Houses Sold:** ${statsArray[i].monthlyHousesSold}
• **Warehouses Sold:** ${statsArray[i].monthlyWarehousesSold}
• **Properties Quoted:** ${statsArray[i].monthlyPropertiesQuoted}
• **Properties Repossessed:** ${statsArray[i].monthlyPropertiesRepod}
• **Train Activities Checked:** ${statsArray[i].monthlyActivityChecks}
• **Misc. Sales Completed:** ${statsArray[i].monthlyMiscSales}\n\n`);
		await dbCmds.resetMonthlyStats(statsArray[i].discordId);
	}

	await editEmbed.editEmbed(client);

	if (lastRep == null || lastRep.includes("Value not found")) {
		var nowMinus7 = now - 604800;
		var lastRep = `<t:${nowMinus7}:d>`
	}

	var embed = new EmbedBuilder()
		.setTitle(`Monthly Realtor Stats Report for ${lastRep} through ${today}:`)
		.setDescription(statsDescList)
		.setColor('EDC531');
	await client.channels.cache.get(process.env.THE_UPSTAIRS_CHANNEL_ID).send({ embeds: [embed] });

	// color palette: https://coolors.co/palette/706677-7bc950-fffbfe-13262b-1ca3c4-b80600-1ec276-ffa630
	await dbCmds.setRepDate("lastRealtorStatsReportDate", today);

};