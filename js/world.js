var World = {
			locations: [
				{
					locationId: 0,
					name: "Поселок Лесное",
					objects: [
						{
							id: 0,
							type: "station",
							name: "Вокзал",
							connectedWith: [1],
							connectedLocations: [[1, 0]]
						},
						{
							id: 1,
							type: "square",
							name: "Площадь Сталина",
							connectedWith: [0, 2]
						},
						{
							id: 2,
							type: "street",
							name: "Улица Баха",
							connectedWith: [1, 3, 4],
						},
						{
							id: 3,
							type: "street",
							name: "Переулок Столыпина",
							connectedWith: [2, 4],
						},
						{
							id: 4,
							type: "house",
							name: "Дом Маркса",
							connectedWith: [2, 3, 5]
						},
						{
							id: 5,
							type: "door",
							name: "Первый подъезд",
							isOpen: true,
							connectedWith: [4, 6],
						},
						{
							id: 6,
							type: "floor",
							name: "Первый этаж",
							isOpen: true,
							connectedWith: [5, 7]
						},
						{
							id: 7,
							type: "flat",
							name: "Квартира №1",
							isOpen: true,
							connectedWith: [6, 8]
						},
						{
							id: 8,
							type: "room",
							name: "Комната",
							isOpen: true,
							connectedWith: [7],
							contains: [9]
						},
						{
							id: 9,
							type: "box",
							name: "Сейф",
							isOpen: false,
							contains: [10],
							connectedWith: [8],
							toOpenNeedObject: {
								locationId: 1,
								id: 4,
							}
						},
						{
							id: 10,
							type: "object",
							weight: 0.2,
							name: "Серебряная сфера",
							accessed: true,
							message: "Поздравляем! Вы нашли свой приз! ;)"
						}
					]
				},
				{
					locationId: 1,
					name: "Поселок им. Булгарина",
					objects: [
						{
							id: 0,
							type: "station",
							name: "Вокзал",
							connectedWith: [1],
							connectedLocations: [[0,0]]
						},
						{
							id: 1,
							type: "house",
							name: "Здание Вокзала",
							connectedWith: [0, 2]
						},
						{
							id: 2,
							type: "room",
							name: "Холл",
							isOpen: true,
							connectedWith: [1],
							contains: [3],
							message: "Вы видите дежурного по вокзалу."
						},
						{
							id: 3,
							type: "man",
							name: "Дежурный Иванов",
							connectedWith: [2],
							contains: [4],
						},
						{
							id: 4,
							type: "key",
							name: "Ключ",
							weight: 0.01,
							accessed: true,
							message: "Вы взяли ключ, теперь вам нужно что-то им открыть..."
						}
					]
				}
			]
		}
