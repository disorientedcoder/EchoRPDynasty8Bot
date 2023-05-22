var dbCmds = require('./dbCmds.js');
var { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports.editEmbed = async (client) => {
	let employeeStats = await dbCmds.currStats();
	let overallDescList = '';

	let now = Math.floor(new Date().getTime() / 1000.0);
	let today = `<t:${now}:d>`;

	for (let i = 0; i < employeeStats.length; i++) {
		if (employeeStats[i].housesSold > 0 || employeeStats[i].warehousesSold > 0 || employeeStats[i].propertiesQuoted > 0 || employeeStats[i].propertiesRepod > 0 || employeeStats[i].activityChecks > 0 || employeeStats[i].miscSales > 0) {
			overallDescList = overallDescList.concat(`__${employeeStats[i].charName}__:
		• **Houses Sold:** ${employeeStats[i].housesSold}
		• **Warehouses Sold:** ${employeeStats[i].warehousesSold}
		• **Properties Quoted:** ${employeeStats[i].propertiesQuoted}
		• **Properties Repossessed:** ${employeeStats[i].propertiesRepod}
		• **Train Activities Checked:** ${employeeStats[i].activityChecks}
		• **Misc. Sales Completed:** ${employeeStats[i].miscSales}\n\n`);
		}
	}

	let overallStatsEmbed = new EmbedBuilder()
		.setTitle(`Overall Realtor Statistics as of ${today}:`)
		.setDescription(overallDescList)
		.setColor('A47E1B');

	let monthlyDescList = '';

	for (let i = 0; i < employeeStats.length; i++) {
		if (employeeStats[i].monthlyHousesSold > 0 || employeeStats[i].monthlyWarehousesSold > 0 || employeeStats[i].monthlyPropertiesQuoted > 0 || employeeStats[i].monthlyPropertiesRepod > 0 || employeeStats[i].monthlyActivityChecks > 0 || employeeStats[i].monthlyMiscSales > 0) {
			monthlyDescList = monthlyDescList.concat(`__${employeeStats[i].charName}__:
		• **Houses Sold:** ${employeeStats[i].monthlyHousesSold}
		• **Warehouses Sold:** ${employeeStats[i].monthlyWarehousesSold}
		• **Properties Quoted:** ${employeeStats[i].monthlyPropertiesQuoted}
		• **Properties Repossessed:** ${employeeStats[i].monthlyPropertiesRepod}
		• **Train Activities Checked:** ${employeeStats[i].monthlyActivityChecks}
		• **Misc. Sales Completed:** ${employeeStats[i].monthlyMiscSales}\n\n`);
		}
	}

	let monthlyStatsEmbed = new EmbedBuilder()
		.setTitle(`Monthly Realtor Statistics as of ${today}:`)
		.setDescription(monthlyDescList)
		.setColor('926C15');

	var channel = await client.channels.fetch(process.env.EMBED_CHANNEL_ID)

	var statsMsgId = await dbCmds.readMsgId("statsMsg");

	var statsMsg = await channel.messages.fetch(statsMsgId);

	statsMsg.edit({ embeds: [overallStatsEmbed, monthlyStatsEmbed] });


	let countHousesSold = await dbCmds.readSummValue("countHousesSold");
	let countWarehousesSold = await dbCmds.readSummValue("countWarehousesSold");
	let countPropertiesQuoted = await dbCmds.readSummValue("countPropertiesQuoted");
	let countPropertiesRepod = await dbCmds.readSummValue("countPropertiesRepod");
	let countTrainActivitiesChecked = await dbCmds.readSummValue("countTrainActivitiesChecked");
	let countMiscSales = await dbCmds.readSummValue("countMiscSales");

	// theme color palette: https://coolors.co/palette/ffe169-fad643-edc531-dbb42c-c9a227-b69121-a47e1b-926c15-805b10-76520e

	countHousesSold = countHousesSold.toString();
	countWarehousesSold = countWarehousesSold.toString();
	countPropertiesQuoted = countPropertiesQuoted.toString();
	countPropertiesRepod = countPropertiesRepod.toString();
	countTrainActivitiesChecked = countTrainActivitiesChecked.toString();
	countMiscSales = countMiscSales.toString();

	var housesSoldEmbed = new EmbedBuilder()
		.setTitle('Amount of Houses Sold:')
		.setDescription(countHousesSold)
		.setColor('#805B10');

	var warehousesSoldEmbed = new EmbedBuilder()
		.setTitle('Amount of Warehouses Sold:')
		.setDescription(countWarehousesSold)
		.setColor('#926C15');

	var propertiesQuotedEmbed = new EmbedBuilder()
		.setTitle('Amount of Properties Quoted:')
		.setDescription(countPropertiesQuoted)
		.setColor('#A47E1B');

	var propertiesRepodEmbed = new EmbedBuilder()
		.setTitle('Amount of Properties Repossessed:')
		.setDescription(countPropertiesRepod)
		.setColor('#B69121');

	var trainActivitiesCheckedEmbed = new EmbedBuilder()
		.setTitle('Amount of Train Activities Checked:')
		.setDescription(countTrainActivitiesChecked)
		.setColor('#C9A227');

	var miscSalesEmbed = new EmbedBuilder()
		.setTitle('Amount of Miscellaneous Sales Completed:')
		.setDescription(countMiscSales)
		.setColor('#C9A227');

	var currEmbed = await dbCmds.readMsgId("embedMsg");

	var channel = await client.channels.fetch(process.env.EMBED_CHANNEL_ID)
	var currMsg = await channel.messages.fetch(currEmbed);

	var btnRows = addBtnRows();

	currMsg.edit({ embeds: [housesSoldEmbed, warehousesSoldEmbed, propertiesQuotedEmbed, propertiesRepodEmbed, trainActivitiesCheckedEmbed, miscSalesEmbed], components: btnRows });
};

function addBtnRows() {
	var row1 = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('addHouseSold')
			.setLabel('Add a House Sale')
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addWarehouseSold')
			.setLabel('Add a Warehouse Sale')
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addMiscSale')
			.setLabel('Add a Misc. Sale')
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addHouseRemodel')
			.setLabel('Add a House Remodel')
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addWarehouseRemodel')
			.setLabel('Add a Warehouse Remodel')
			.setStyle(ButtonStyle.Success),
	);

	var row2 = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('addPropQuoted')
			.setLabel('Add a Property Quote')
			.setStyle(ButtonStyle.Primary),

		new ButtonBuilder()
			.setCustomId('addPropRepod')
			.setLabel('Add a Property Repo')
			.setStyle(ButtonStyle.Primary),

		new ButtonBuilder()
			.setCustomId('addTrainCheck')
			.setLabel('Add a Train Check')
			.setStyle(ButtonStyle.Primary),
	);

	var row3 = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('addFinancingAgreement')
			.setLabel('Add a Financing Agreement')
			.setStyle(ButtonStyle.Secondary),

		new ButtonBuilder()
			.setCustomId('addFinancingPayment')
			.setLabel('Add a Financing Payment')
			.setStyle(ButtonStyle.Secondary),
	);

	var rows = [row1, row2, row3];
	return rows;
};