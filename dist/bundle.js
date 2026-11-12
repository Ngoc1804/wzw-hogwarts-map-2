(()=>{
const root=document.getElementById('wzw-map');if(!root)throw Error('Missing wzw-map root');root.innerHTML="<div class=\"sheet\"><header><div class=\"brand\"><div class=\"seal\"><svg aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" viewbox=\"0 0 24 24\">\n<circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n<path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\"></path>\n</svg>\n</div><div><div class=\"intro\">Địa bàn của mớ Phù thuỷ mộng mơ</div><h1>WIZAMAP</h1><div class=\"quote\">Đi lạc có chiến lược vẫn tính là đi lạc.</div></div></div><div class=\"header-right\"><div class=\"zone\" id=\"zone\">Khuôn Viên Lâu Đài Hogwarts</div><div class=\"clock\">10:25 Sáng</div><div class=\"date\">11 / 09 / 1992</div></div></header><div class=\"layout\"><main aria-label=\"Bản đồ tương tác\" class=\"viewport\"><div class=\"map-tools\"><button aria-label=\"Phóng to\" class=\"tool\" id=\"zoom-in\" title=\"Phóng to\">+</button><button aria-label=\"Thu nhỏ\" class=\"tool\" id=\"zoom-out\" title=\"Thu nhỏ\">−</button><button aria-label=\"Toàn cảnh\" class=\"tool\" id=\"fit\" title=\"Toàn cảnh\">⤢</button><button aria-label=\"Về vị trí BẠN\" class=\"tool\" id=\"locate\" title=\"Về vị trí BẠN\"><svg aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" viewbox=\"0 0 24 24\">\n<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"></path>\n<circle cx=\"12\" cy=\"10\" r=\"3\"></circle>\n</svg>\n</button></div><div class=\"map-caption\" id=\"map-caption\">HOGWARTS &amp; HOGSMEADE · NGOẠI CẢNH</div><div class=\"mapmount\" id=\"mapmount\"></div><div class=\"legend\"><span><b>◆</b> Vị trí của bạn</span><span><b>♧</b> Nhân vật đã biết</span><span><b>✧</b> Đầu mối</span></div><div class=\"hintline\">Lia vào để xem địa điểm · Kéo để khám phá</div></main><aside aria-label=\"Thông tin địa điểm\"><button aria-expanded=\"false\" class=\"drawer-toggle\" id=\"drawer-toggle\"><span id=\"drawer-name\">Vị trí</span><span>Thông tin ↕</span></button><div class=\"identity\"><div class=\"eyebrow\"><svg aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" viewbox=\"0 0 24 24\">\n<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"></path>\n<circle cx=\"12\" cy=\"10\" r=\"3\"></circle>\n</svg>\n\n\n VỊ TRÍ</div><h2 id=\"place-title\"></h2><div class=\"area\" id=\"place-area\"></div><div class=\"ornament\">❧</div></div><section><h3><svg aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" viewbox=\"0 0 24 24\">\n<path d=\"M15 12h-5\"></path>\n<path d=\"M15 8h-5\"></path>\n<path d=\"M19 17V5a2 2 0 0 0-2-2H4\"></path>\n<path d=\"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3\"></path>\n</svg>\n\n\n NGHE HÓNG</h3><p id=\"activity\"></p></section><section><h3><svg aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" viewbox=\"0 0 24 24\">\n<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"></path>\n<circle cx=\"12\" cy=\"12\" r=\"3\"></circle>\n</svg>\n\n\n QUAN SÁT</h3><p id=\"observation\"></p></section><section><h3><svg aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" viewbox=\"0 0 24 24\">\n<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"></path>\n<path d=\"M16 3.128a4 4 0 0 1 0 7.744\"></path>\n<path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"></path>\n<circle cx=\"9\" cy=\"7\" r=\"4\"></circle>\n</svg>\n\n\n AI ĐÓ</h3><div class=\"actors\" id=\"actors\"></div></section><section><div class=\"questhead\"><h3><svg aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" viewbox=\"0 0 24 24\">\n<path d=\"M15 12h-5\"></path>\n<path d=\"M15 8h-5\"></path>\n<path d=\"M19 17V5a2 2 0 0 0-2-2H4\"></path>\n<path d=\"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3\"></path>\n</svg>\n\n\n HÓNG HỚT TÁM PHƯƠNG</h3><small id=\"hintcount\"></small></div><div id=\"quests\"></div></section><div class=\"sidebar-foot\">Cảnh giả lập để duyệt giao diện.<br/>Chọn công trình hoặc bảng tên để xem chi tiết.</div></aside></div><footer><span>WIZAMAP · ATLAS CỦA NHỮNG KẺ ĐI LẠC</span><button id=\"open-sources\">Nguồn &amp; giấy phép</button><span>WZW MAP 2 · TEMPLATE VÀ GIAO DIỆN</span></footer></div><dialog id=\"sources\"><div class=\"dialog-head\"><div><small>03 / NGUỒN THIẾT KẾ</small><h2>Tài nguyên và giấy phép</h2></div><button aria-label=\"Đóng\" class=\"close\">×</button></div><div class=\"dialog-body sources\"><p>Kiến trúc ngoài trời, cụm làng, cây cối và địa hình: tái sử dụng SVG có sẵn trong <b>H1_Hogwarts_Hogsmeade.html</b> bạn cung cấp. Mỗi công trình vẫn là phần tử tương tác riêng.</p><p>Nội thất, phòng, cửa và nội thất trang trí: tái sử dụng renderer WIZAMAP-Restored của dự án. Quyền sử dụng phần minh họa theo SVG-LICENSE.txt trong repo.</p><p>Icon: Lucide, ISC License. Đã nhúng trực tiếp để bản duyệt không phụ thuộc CDN.</p><p>Bộ xem dùng SVG và JavaScript trực tiếp, chạy offline. Kiến trúc và texture giữ từ tài nguyên đã duyệt.</p><details><summary>Giấy phép asset QA V2</summary><pre class=\"source-detail\">paperjs\nCopyright (c) 2011 - 2020, Jürg Lehni &amp; Jonathan Puckey\nhttp://juerglehni.com/ &amp; https://puckey.studio/\nAll rights reserved.\n\n\nThe MIT License (MIT)\n\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\nTHE SOFTWARE.\n\n\n\n\nroughjs\nMIT License\n\n\nCopyright (c) 2019 Preet Shihn\n\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n\n\n\n\n\nlucide\nISC License\n\n\nCopyright (c) 2026 Lucide Icons and Contributors\n\n\nPermission to use, copy, modify, and/or distribute this software for any\npurpose with or without fee is hereby granted, provided that the above\ncopyright notice and this permission notice appear in all copies.\n\n\nTHE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES\nWITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF\nMERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR\nANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES\nWHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN\nACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF\nOR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.\n\n\n---\n\n\nThe following Lucide icons are derived from the Feather project:\n\n\nairplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out\n\n\nThe MIT License (MIT) (for the icons listed above)\n\n\nCopyright (c) 2013-present Cole Bemis\n\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n\n\n\n\n\nebGaramond\nGoogle Inc.\n\n\nThis Font Software is licensed under the SIL Open Font License, Version 1.1.\nThis license is copied below, and is also available with a FAQ at:\nhttp://scripts.sil.org/OFL\n\n\n\n\n-----------------------------------------------------------\nSIL OPEN FONT LICENSE Version 1.1 - 26 February 2007\n-----------------------------------------------------------\n\n\nPREAMBLE\nThe goals of the Open Font License (OFL) are to stimulate worldwide\ndevelopment of collaborative font projects, to support the font creation\nefforts of academic and linguistic communities, and to provide a free and\nopen framework in which fonts may be shared and improved in partnership\nwith others.\n\n\nThe OFL allows the licensed fonts to be used, studied, modified and\nredistributed freely as long as they are not sold by themselves. The\nfonts, including any derivative works, can be bundled, embedded,\nredistributed and/or sold with any software provided that any reserved\nnames are not used by derivative works. The fonts and derivatives,\nhowever, cannot be released under any other type of license. The\nrequirement for fonts to remain under this license does not apply\nto any document created using the fonts or their derivatives.\n\n\nDEFINITIONS\n\"Font Software\" refers to the set of files released by the Copyright\nHolder(s) under this license and clearly marked as such. This may\ninclude source files, build scripts and documentation.\n\n\n\"Reserved Font Name\" refers to any names specified as such after the\ncopyright statement(s).\n\n\n\"Original Version\" refers to the collection of Font Software components as\ndistributed by the Copyright Holder(s).\n\n\n\"Modified Version\" refers to any derivative made by adding to, deleting,\nor substituting -- in part or in whole -- any of the components of the\nOriginal Version, by changing formats or by porting the Font Software to a\nnew environment.\n\n\n\"Author\" refers to any designer, engineer, programmer, technical\nwriter or other person who contributed to the Font Software.\n\n\nPERMISSION &amp; CONDITIONS\nPermission is hereby granted, free of charge, to any person obtaining\na copy of the Font Software, to use, study, copy, merge, embed, modify,\nredistribute, and sell modified and unmodified copies of the Font\nSoftware, subject to the following conditions:\n\n\n1) Neither the Font Software nor any of its individual components,\nin Original or Modified Versions, may be sold by itself.\n\n\n2) Original or Modified Versions of the Font Software may be bundled,\nredistributed and/or sold with any software, provided that each copy\ncontains the above copyright notice and this license. These can be\nincluded either as stand-alone text files, human-readable headers or\nin the appropriate machine-readable metadata fields within text or\nbinary files as long as those fields can be easily viewed by the user.\n\n\n3) No Modified Version of the Font Software may use the Reserved Font\nName(s) unless explicit written permission is granted by the corresponding\nCopyright Holder. This restriction only applies to the primary font name as\npresented to the users.\n\n\n4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font\nSoftware shall not be used to promote, endorse or advertise any\nModified Version, except to acknowledge the contribution(s) of the\nCopyright Holder(s) and the Author(s) or with their explicit written\npermission.\n\n\n5) The Font Software, modified or unmodified, in part or in whole,\nmust be distributed entirely under this license, and must not be\ndistributed under any other license. The requirement for fonts to\nremain under this license does not apply to any document created\nusing the Font Software.\n\n\nTERMINATION\nThis license becomes null and void if any of the above conditions are\nnot met.\n\n\nDISCLAIMER\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT\nOF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE\nCOPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\nINCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL\nDAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\nFROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM\nOTHER DEALINGS IN THE FONT SOFTWARE.\n</pre></details><p>Bản kiểm template và giao diện. Không cấp nhân vật hoặc sự kiện thì không tự sinh nội dung RP. Cơ chế MAP_DATA đầy đủ sẽ được nối ở phần tích hợp Map 2.</p></div></dialog><div class=\"toast\" id=\"toast\" role=\"status\"></div><svg aria-hidden=\"true\" height=\"0\" style=\"position:absolute;pointer-events:none\" width=\"0\"><defs><g id=\"demo-shoe-l\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M-3,-8C-5.5,-8 -6.8,-4.8 -6.6,-.8 -6.4,2.2 -5.2,4.6 -4.2,6 -3,6.5 -.2,6.5 .8,6 1.7,4.4 2.4,1.6 2.2,-1.4 1.9,-5.2 -.2,-8 -3,-8Z\"></path><path d=\"M-4.5,8.4C-3.2,8 -.4,8 .6,8.4L.3,12.6C.1,14.3 -1,14.9 -2.1,14.9 -3.2,14.9 -4.3,14.2 -4.5,12.6Z\"></path></g>\n<g id=\"demo-shoe-r\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M3,-8C5.5,-8 6.8,-4.8 6.6,-.8 6.4,2.2 5.2,4.6 4.2,6 3,6.5 .2,6.5 -.8,6 -1.7,4.4 -2.4,1.6 -2.2,-1.4 -1.9,-5.2 .2,-8 3,-8Z\"></path><path d=\"M4.5,8.4C3.2,8 .4,8 -.6,8.4L-.3,12.6C-.1,14.3 1,14.9 2.1,14.9 3.2,14.9 4.3,14.2 4.5,12.6Z\"></path></g>\n</defs></svg>";
const TOKENS={
  "schemaVersion": "1.0.0",
  "owner": "Wizawi – Toà soạn Mộng Mị",
  "sourceCommit": "9e54f6af50bfb3b9c1429d36c88eed0d1eb87d7f",
  "placeTags": false,
  "maxNpcTags": 10,
  "colors": {
    "gryffindor": {
      "name": "Gryffindor",
      "main": "#8C2939",
      "accent": "#D2A64D"
    },
    "slytherin": {
      "name": "Slytherin",
      "main": "#285846",
      "accent": "#B8C3BD"
    },
    "ravenclaw": {
      "name": "Ravenclaw",
      "main": "#315878",
      "accent": "#B98551"
    },
    "hufflepuff": {
      "name": "Hufflepuff",
      "main": "#D4AA44",
      "accent": "#3D3830"
    },
    "beauxbatons": {
      "name": "Beauxbatons",
      "main": "#83AFD0",
      "accent": "#3F6484"
    },
    "durmstrang": {
      "name": "Durmstrang",
      "main": "#722E3A",
      "accent": "#B18B5F"
    },
    "teacher": {
      "name": "Giáo viên",
      "main": "#685579",
      "accent": "#C5A66F"
    },
    "adult": {
      "name": "Người lớn bên ngoài",
      "main": "#7D5C42",
      "accent": "#C5AA82"
    },
    "patrol": {
      "name": "Giám thị / Tuần tra",
      "main": "#E32636",
      "accent": "#303238"
    },
    "animal": {
      "name": "Động vật",
      "main": "#627A50",
      "accent": "#C8B07D"
    },
    "monster": {
      "name": "Quái vật",
      "main": "#573646",
      "accent": "#A96D60"
    },
    "ghost": {
      "name": "Ma / Linh hồn",
      "main": "#54818A",
      "accent": "#C5DBD7"
    },
    "unknown": {
      "name": "Không rõ phe",
      "main": "#706557",
      "accent": "#C2AD92"
    },
    "crowd": {
      "name": "Nhóm / Đám đông",
      "main": "#526E73",
      "accent": "#D5BD8A"
    }
  },
  "style": {
    "paper": "#eee4d1",
    "ink": "#49362b",
    "muted": "#8a745e",
    "red": "#713b37",
    "line": "#baa585",
    "header": "#3B2925"
  },
  "motion": {
    "idlePeriodMs": 6400,
    "stepMs": 550,
    "steps": 6,
    "hideMs": 2000,
    "reduced": "idle alternation, no translation"
  },
  "patrolRule": "Use patrol only while explicitly on patrol; prefect otherwise uses normal identity"
};

const NS='http://www.w3.org/2000/svg';
const KEYS=Object.keys(TOKENS.colors);
const COLORS=Object.values(TOKENS.colors).map(c=>[c.name,c.main,c.accent]);
function ribbon(name,index=0,pc=false){const [,main,accent]=COLORS[index],N='http://www.w3.org/2000/svg',b=document.createElement('button');b.className='ribbon'+(pc?' pc':'')+([3,4,9,11].includes(index)?' light':'');b.style.setProperty('--main',main);b.style.setProperty('--accent',accent);const w=Math.max(140,Math.min(260,Array.from(name).length*8+60));b.style.width=(w*.7)+'px';b.setAttribute('aria-label',name);const v=document.createElementNS(N,'svg');v.setAttribute('viewBox',`0 0 ${w} 44`);v.setAttribute('aria-hidden','true');const path=(d,fill,stroke)=>{const p=document.createElementNS(N,'path');p.setAttribute('d',d);p.setAttribute('fill',fill);p.setAttribute('stroke',stroke);p.setAttribute('stroke-width','1.1');v.append(p);return p};path(`M0 12H31V38H0L10 25Z M${w} 12H${w-31}V38H${w}L${w-10} 25Z`,accent,main);path(`M23 7L31 12V38L23 33Z M${w-23} 7L${w-31} 12V38L${w-23} 33Z`,main,main);path(`M23 7Q${w/2}-3 ${w-23} 7V34Q${w/2} 24 23 34Z`,main,accent);path(`M30 11Q${w/2} 2 ${w-30} 11`,'none',accent);const text=document.createElementNS(N,'text');text.setAttribute('x',w/2);text.setAttribute('y','26');text.setAttribute('text-anchor','middle');text.setAttribute('fill',[3,4,9,11].includes(index)?'#172344':'#f8edda');text.setAttribute('style','font:600 17px Georgia,serif');text.textContent=name;v.append(text);b.append(v);return b}
function chip(name,index,pc){const b=document.createElement('button');b.className='actor-chip'+([3,4,9,11].includes(index)?' light':'');b.style.setProperty('--main',COLORS[index][1]);b.style.setProperty('--accent',COLORS[index][2]);b.textContent=name;return b}
function addUse(g,side){const e=document.createElementNS(NS,'use');e.setAttribute('href','#demo-shoe-'+side);g.append(e);return e}
function setupFeet(g){g.replaceChildren();if(g.dataset.motion==='idle'){
 const l=addUse(g,'r'),r=addUse(g,'l');l.setAttribute('transform','translate(-8 0) rotate(-6)');r.setAttribute('transform','translate(8 0) rotate(6)');
}else for(let i=0;i<6;i++){const e=addUse(g,i%2?'l':'r');e.setAttribute('transform',`translate(${i%2?7:-7} ${-i*17}) rotate(${i%2?6:-6})`);e.style.opacity='0'}}


function tagType(actor) {
  if (actor.onPatrol === true && ['prefect','patrol','caretaker'].includes(actor.role)) return 'patrol';
  if (actor.entityType === 'group' && !actor.tagType) return 'crowd';
  return KEYS.includes(actor.tagType) && (actor.tagType !== 'patrol' || actor.onPatrol === true) ? actor.tagType : 'unknown';
}
function actorTag(actor, compact=false) {
  const type=tagType(actor), index=KEYS.indexOf(type);
  const label=actor.isPC ? `★ ${actor.name || 'BẠN'} ★` : actor.name || 'Chưa rõ';
  const element=compact?chip(label,index,actor.isPC):ribbon(label,index,actor.isPC);
  if(actor.isPC) {element.classList.add('pc');element.style.setProperty('--accent','#D2A64D');}
  element.dataset.tagType=type;
  return element;
}
function feetState(elapsed, stance='idle', reduced=false) {
  if(stance!=='walk'||reduced) {
    const f=Math.sin(elapsed/6400*Math.PI*2)*.05;
    return [.95+f,.95-f];
  }
  const t=((elapsed%5300)+5300)%5300, step=Math.floor(t/550);
  return Array.from({length:6},(_,i)=>t<3300&&i===step?1:0);
}
const feetJobs=new Set();let feetTimer;
function mountFeet(g,stance='idle'){
 if(stance==='hidden'){g.replaceChildren();return()=>{}}const reduced=matchMedia('(prefers-reduced-motion: reduce)');const job={g,stance,reduced,origin:performance.now(),mode:null};feetJobs.add(job);
 if(!feetTimer)feetTimer=setInterval(()=>{if(document.hidden||document.body.classList.contains('motion-off'))return;const now=performance.now();for(const j of feetJobs){const next=j.reduced.matches?'idle':j.stance;if(next!==j.mode){j.mode=next;j.g.dataset.motion=next;setupFeet(j.g)}const values=feetState(now-j.origin,j.stance,j.reduced.matches);[...j.g.children].forEach((n,i)=>n.style.opacity=String(j.valid&&!j.valid(n)?0:(values[i]??0)));}},100);
 return ()=>{feetJobs.delete(job);if(!feetJobs.size){clearInterval(feetTimer);feetTimer=null}};
}



// Approved Fixed artwork; only its referenced shared definitions are retained.
// H1 motion hooks follow the original Demo 1 effects. Static symbol geometry is never mutated.
function mountH1Motion(svg,enabled){
 const N='http://www.w3.org/2000/svg',cam=svg.querySelector('#camera')||svg,callbacks=[],created=[];let raf=0,last=0,clock=0,previous=0,disposed=false;
 const make=(tag,a,p=cam)=>{const e=document.createElementNS(N,tag);for(const[k,v]of Object.entries(a))e.setAttribute(k,v);p.append(e);return e};
 const G=(p,a={})=>make('g',a,p),P=(p,d,a={})=>make('path',{d,fill:'none',stroke:'#9c9277','stroke-width':1,...a},p),cycle=(t,d,delay=0)=>((t-delay)%d+d)%d/d;
 function rotate(e,amplitude,duration,pivot,delay=0){if(!e)return;e.style.removeProperty('transform');e.style.removeProperty('transform-origin');e.style.removeProperty('transform-box');const base=e.getAttribute('transform')||'',b=e.getBBox(),x=pivot?.[0]??b.x+b.width/2,y=pivot?.[1]??b.y+b.height;callbacks.push(t=>e.setAttribute('transform',base+` rotate(${Math.sin((t+delay)/duration*2*Math.PI)*amplitude} ${x} ${y})`))}
 function smoke(parent,x,y,scale=1){const wrap=G(parent,{transform:`translate(${x} ${y}) scale(${scale})`,'data-live-effect':'smoke','pointer-events':'none'});created.push(wrap);for(let i=0;i<4;i++){const g=G(wrap);P(g,'M0 0C-15-10 14-20 0-33C-12-44 15-48 5-60',{stroke:'#8a8375','stroke-width':5,'stroke-linecap':'round'});callbacks.push(t=>{const f=cycle(t,5,i*1.25);g.setAttribute('transform',`translate(${f*13} ${-f*36}) scale(${.35+f*.9})`);g.setAttribute('opacity',Math.sin(f*Math.PI)*.38)})}}
 // Remove inert frame captures of effects replaced by the controlled live layers.
 for(const e of [...svg.querySelectorAll('.v12-smoke-layer,[data-effect="village-smoke"],[data-effect="boathouse-rope"]')])e.remove();
 for(const e of svg.querySelectorAll('[data-emitter="chimney"]'))smoke(e,0,0,.55);
 for(const e of svg.querySelectorAll('[data-effect="train-smoke"],[data-effect="train-steam"]')){e.replaceChildren();smoke(e,0,0,.9)}
 for(const [i,e]of [...svg.querySelectorAll('.cloth')].entries()){
  const first=(e.getAttribute('d')||'').match(/^M\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/);if(!first)continue;const x=+first[1],y=+first[2],w=Math.max(12,e.getBBox().width);e.style.removeProperty('transform');
  callbacks.push(t=>{const a=Math.sin(t*3.4+i*.5)*4;e.setAttribute('d',`M${x} ${y}C${x+w*.4} ${y+a} ${x+w*.6} ${y-a} ${x+w} ${y+2}L${x+w} ${y+10}C${x+w*.6} ${y+8-a} ${x+w*.4} ${y+8+a} ${x} ${y+8}Z`)})
 }
 for(const [i,e]of [...svg.querySelectorAll('.window-light-wash')].entries()){e.style.removeProperty('opacity');callbacks.push(t=>e.setAttribute('opacity',.09+.14*(.5+.5*Math.sin(t/(2.5+i%4)*Math.PI+i))))}
 for(const [i,e]of [...svg.querySelectorAll('.lamp-glow')].entries()){e.style.removeProperty('opacity');callbacks.push(t=>e.setAttribute('opacity',.88+.12*Math.sin(t*.8+i)))}
 for(const [i,e]of [...svg.querySelectorAll('[data-window]')].entries()){
  const glow=e.cloneNode(false);glow.removeAttribute('id');glow.removeAttribute('data-window');glow.setAttribute('fill','#e8ce8f');glow.setAttribute('pointer-events','none');e.after(glow);created.push(glow);callbacks.push(t=>glow.setAttribute('opacity',.10+.13*(.5+.5*Math.sin(t*1.1+i))))
 }
 rotate(svg.querySelector('.ancient-canopy'),.65,8,[320,280]);
 for(const [i,e]of [...svg.querySelectorAll('[data-oak-cluster]')].filter((_,i)=>i%4===0).entries())rotate(e,1,6+i*.3,[+e.dataset.pivotX,+e.dataset.pivotY],i*.7);
 for(const [i,e]of [...svg.querySelectorAll('[data-willow-strand]')].entries()){if(i%2)continue;rotate(e,2.2,8+i*.04,[0,0],i*.15)}
 const mist=svg.querySelector('[data-effect="v12-forest-mist"]');if(mist){for(const [i,e]of [...mist.children].entries()){e.style.removeProperty('transform');e.style.removeProperty('opacity');callbacks.push(t=>{const f=cycle(t,14+i*2,i*3);e.setAttribute('transform',`translate(${-160+f*350} 0)`);e.setAttribute('opacity',Math.sin(f*Math.PI)*.21)})}}
 const pitch=svg.querySelector('[data-element="r2-pitch"]'),track=pitch?.querySelector('.flight-track'),broom=pitch?.querySelector('.flying-broom'),snitch=pitch?.querySelector('.flying-snitch');
 if(track&&broom){const len=track.getTotalLength();callbacks.push(t=>{const f=cycle(t,11),p=track.getPointAtLength(f*len),q=track.getPointAtLength((f*len+2)%len);broom.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI})`);if(snitch){const z=track.getPointAtLength(((f+.1)%1)*len);snitch.setAttribute('transform',`translate(${z.x} ${z.y})`)}})}
 const outline=svg.querySelector('[data-lake-outline]');
 if(outline){
  const b=outline.getBBox(),m=cam.getCTM().inverse().multiply(outline.getCTM()),pts=[[b.x,b.y],[b.x+b.width,b.y+b.height]].map(p=>new DOMPoint(...p).matrixTransform(m)),x=pts[0].x,y=pts[0].y,w=pts[1].x-x,h=pts[1].y-y;
  const layer=G(cam,{'data-live-effect':'lake','pointer-events':'none'});created.push(layer);
  const boat=G(layer,{'data-live-effect':'boat'});P(boat,'M-13-3Q0 5 13-3Q7 11-7 8Z',{fill:'#a98e64',stroke:'#78654b'});P(boat,'M-8 1l15 3M1 1l-6-13',{stroke:'#d1ba89','stroke-width':1.1});
  callbacks.push(t=>{const a=cycle(t,26)*2*Math.PI;boat.setAttribute('transform',`translate(${x+w*.56+Math.cos(a)*w*.13} ${y+h*.52+Math.sin(a)*h*.13}) rotate(${Math.sin(a)*8})`)});
  for(let i=0;i<5;i++){const e=make('ellipse',{cx:x+w*(.3+i*.09),cy:y+h*(.27+i*.09),rx:3,ry:1,fill:'none',stroke:'#d4dfc5','stroke-width':.9},layer);callbacks.push(t=>{const f=cycle(t,5,i);e.setAttribute('rx',3+f*24);e.setAttribute('ry',1+f*8);e.setAttribute('opacity',Math.sin(f*Math.PI)*.5)})}
 }
 for(const [i,e]of [...svg.querySelectorAll('.boat-rock')].entries())rotate(e,.6,7+i);
 const owl=svg.querySelector('[data-effect="owl"]');if(owl){owl.style.removeProperty('transform');callbacks.push(t=>{const a=cycle(t,35)*Math.PI*2;owl.setAttribute('transform',`translate(${130+Math.cos(a)*90} ${100+Math.sin(a)*30}) scale(.7)`);owl.setAttribute('opacity',cycle(t,35)<.5?.8:0)})}
 const peek=svg.querySelector('[data-effect="owl-post-head"]');if(peek){peek.style.removeProperty('opacity');callbacks.push(t=>{const f=cycle(t,28);peek.setAttribute('opacity',f>.3&&f<.58?Math.min(1,(f-.3)*15,(.58-f)*15):0)})}
 for(const [id,count]of [['lakeside-tree',3],['region-6',2]]){const root=svg.querySelector(`[data-id="${id}"]`);if(!root)continue;const b=root.getBBox(),m=cam.getCTM().inverse().multiply(root.getCTM()),origin=new DOMPoint(b.x+b.width*.6,b.y+b.height*.3).matrixTransform(m);for(let i=0;i<count;i++){const leaf=G(cam,{'pointer-events':'none','data-live-effect':'leaf-drift'});P(leaf,'M-2 0Q1-5 5 0Q1 4-2 0Z',{fill:'#a4a17a',stroke:'#888c66','stroke-width':.4});created.push(leaf);callbacks.push(t=>{const f=cycle(t,18+i*2,i*5);leaf.setAttribute('transform',`translate(${origin.x+f*45} ${origin.y+f*45+Math.sin(f*Math.PI*3+i)*5}) rotate(${f*140})`);leaf.setAttribute('opacity',Math.sin(f*Math.PI)*.5)})}}
 for(const e of svg.querySelectorAll('[data-layer="decor"][data-optional="sign"]'))rotate(e,.7,8);
 const greenhouse=svg.querySelector('[data-element="h1.greenhouses"]');for(const [i,e]of [...(greenhouse?.querySelectorAll('[data-color-fill="foliage"]')||[])].slice(0,3).entries())rotate(e,1.8,6+i);
 for(const i of [0,1,5]){const art=svg.querySelector(`[data-id="village-house-${i}"] [data-element]`),board=[...(art?.querySelectorAll('rect')||[])].find(e=>e.getAttribute('width')==='48'&&e.getAttribute('height')==='27');if(board){const g=G(board.parentNode,{'data-live-effect':'shop-sign'}),b=board.getBBox();g.append(board);rotate(g,.8,8+i,[b.x+b.width/2,b.y])}}
 function tick(now){if(disposed)return;raf=requestAnimationFrame(tick);if(now-last<32)return;last=now;const dt=previous?Math.min(.08,(now-previous)/1000):0;previous=now;if(!enabled()||document.hidden)return;clock+=dt;for(const cb of callbacks)cb(clock);svg.dataset.motionTick=clock.toFixed(2)}
 for(const cb of callbacks)cb(0);svg.dataset.motionEffects=callbacks.length;raf=requestAnimationFrame(tick);
 return ()=>{disposed=true;cancelAnimationFrame(raf);for(const e of created)e.remove()};
}

const $=s=>document.querySelector(s);
let DATA=null, svg=null, vb=null, originalVB=null, activeId='h1', moving=true, drag=null;
let stopScene=()=>{};
function put(id,value){const e=$(id);if(e)e.textContent=value||''}
function getVB(node){return (node.getAttribute('viewBox')||'0 0 1400 1000').trim().split(/[ ,]+/).map(Number)}
function paintVB(){if(svg&&vb)svg.setAttribute('viewBox',vb.join(' '));presentation?.renderPositions()}
function fit(){if(!svg)return;vb=[...originalVB];paintVB()}
function zoom(f){if(!vb)return;vb=[vb[0]+vb[2]*(1-f)/2,vb[1]+vb[3]*(1-f)/2,vb[2]*f,vb[3]*f];paintVB()}
function getPoint(){if(!svg)return null;const r=svg.getBoundingClientRect();if(!r.width||!r.height)return null;const ratio=Math.min(r.width/vb[2],r.height/vb[3]);const w=vb[2]*ratio,h=vb[3]*ratio;return {r,left:r.left+(r.width-w)/2,top:r.top+(r.height-h)/2,k:ratio}}
function eventClick(e){if(svg.dataset.dragged==='true'){svg.dataset.dragged='false';return}const node=e.target.closest('[data-id]');if(!node)return;
 const id=node.dataset.id||'',place=(DATA.maps[activeId].places||[]).find(p=>p.id===id),label=place?.name||node.getAttribute('aria-label')||node.dataset.name||node.dataset.label||id;
 put('#place-title',label.replace(/[-_]/g,' '));put('#drawer-name',label.replace(/[-_]/g,' '));
 put('#activity','');put('#observation',place?.desc||'Chưa có mô tả cho địa điểm này.');presentation?.showPlaceActors(id);
 svg.querySelectorAll('.map-selected').forEach(x=>x.classList.remove('map-selected'));node.classList.add('map-selected');
}
async function setTemplate(id){if(!DATA?.maps[id])return;activeId=id;stopScene();
 const doc=new DOMParser().parseFromString(DATA.maps[id].svg,'image/svg+xml');svg=document.importNode(doc.documentElement,true);
 const refs=new Set(),stack=[svg.outerHTML];while(stack.length){const s=stack.pop();for(const m of s.matchAll(/(?:href=["']#|url\(#)([^"') ]+)/g)){if(!refs.has(m[1])&&DATA.vectors[m[1]]){refs.add(m[1]);stack.push(DATA.vectors[m[1]])}}}
 const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');defs.innerHTML=[...refs].map(x=>DATA.vectors[x]).join('');svg.prepend(defs);
 originalVB=DATA.maps[id].bounds||getVB(svg);if(!Array.isArray(originalVB)||originalVB.length!==4)originalVB=getVB(svg);vb=[...originalVB];svg.setAttribute('viewBox',vb.join(' '));
 $('#mapmount').replaceChildren(svg);if(id==='h1')stopScene=mountH1Motion(svg,()=>moving&&!matchMedia('(prefers-reduced-motion: reduce)').matches);svg.addEventListener('click',eventClick);
 svg.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?.88:1.14)},{passive:false});
 svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,box:[...vb]};drag.moved=false});
 svg.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<4)return;drag.moved=true;svg.setPointerCapture(e.pointerId);const z=getPoint();if(!z)return;vb=[drag.box[0]-(e.clientX-drag.x)/z.k,drag.box[1]-(e.clientY-drag.y)/z.k,drag.box[2],drag.box[3]];paintVB()});
 svg.addEventListener('pointerup',()=>{svg.dataset.dragged=String(!!drag?.moved);drag=null});svg.addEventListener('pointercancel',()=>drag=null);
 let title=DATA.maps[id].title||id;put('#zone',title);put('#place-title',title);put('#drawer-name',title);put('#place-area','BẢN ĐỒ CỐ ĐỊNH');
 put('#activity','Không có hoạt động RP được cấp.');put('#observation','Chọn công trình hoặc địa điểm trong bản đồ để xem nhãn gốc.');
 put('#actors','');put('#hintcount','0');$('#quests').replaceChildren();
 put('#map-caption',title.toUpperCase());
 await prepareTemplateUI();
 for(const b of document.querySelectorAll('[data-template]')){b.classList.toggle('active',b.dataset.template===id);b.setAttribute('aria-pressed',String(b.dataset.template===id));}
 for(const b of document.querySelectorAll('[data-primary]')){const q={A:'h1',B:'hall',C:'ministry2',D:'express'}[b.dataset.primary];b.classList.toggle('active',q===id)}

}
// Template-only presentation adapter. MAP_DATA remains the future contract's responsibility.
let presentation=null;
function worldBox(node){const b=node.getBBox(),m=svg.getScreenCTM().inverse().multiply(node.getScreenCTM()),p=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m)),xs=p.map(p=>p.x),ys=p.map(p=>p.y);return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)}}
function inMap(x,y,pad=0){return x-pad>=originalVB[0]&&y-pad>=originalVB[1]&&x+pad<=originalVB[0]+originalVB[2]&&y+pad<=originalVB[1]+originalVB[3]}
function uiElement(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);parent?.append(e);return e}
async function paintedMask(node){
 const box=worldBox(node);if(!box.w||!box.h)return null;
 const scale=Math.min(2,1024/Math.max(box.w,box.h)),w=Math.max(1,Math.ceil(box.w*scale)),h=Math.max(1,Math.ceil(box.h*scale));
 const root=uiElement('svg',{xmlns:NS,viewBox:`${box.x} ${box.y} ${box.w} ${box.h}`,width:w,height:h});
 for(const d of svg.querySelectorAll('defs'))root.append(d.cloneNode(true));
 const m=svg.getScreenCTM().inverse().multiply(node.getScreenCTM());const g=uiElement('g',{transform:`matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`},root),copy=node.cloneNode(true);
 copy.removeAttribute('transform');copy.removeAttribute('opacity');copy.removeAttribute('style');copy.classList.remove('map-selected','occluded');
 // Retain inherited presentation tokens, but not hover/X-Ray filters or interactive rectangles.
 for(const name of ['--base','--foliage','--ink','--surface','--wall','--roof','--detail']){const v=getComputedStyle(node).getPropertyValue(name);if(v)copy.style.setProperty(name,v)}
 for(const e of [copy,...copy.querySelectorAll('*')]){e.style.animation='none';e.style.filter='none';if(e.classList.contains('spot-hit'))e.remove();}
 g.append(copy);const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(root)],{type:'image/svg+xml'}));
 try{const img=new Image();img.src=url;await img.decode();const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,w,h);return{box,w,h,pixels:ctx.getImageData(0,0,w,h).data};}finally{URL.revokeObjectURL(url)}
}
function alphaAt(mask,x,y){if(!mask)return 0;const{box,w,h,pixels}=mask,ix=Math.floor((x-box.x)/box.w*w),iy=Math.floor((y-box.y)/box.h*h);return ix<0||iy<0||ix>=w||iy>=h?0:pixels[(iy*w+ix)*4+3]}
function maskOverlaps(mask,b){if(!mask)return false;const{box,w,h,pixels}=mask;const x0=Math.max(0,Math.floor((b.x-box.x)/box.w*w)),x1=Math.min(w,Math.ceil((b.x+b.w-box.x)/box.w*w)),y0=Math.max(0,Math.floor((b.y-box.y)/box.h*h)),y1=Math.min(h,Math.ceil((b.y+b.h-box.y)/box.h*h));for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(pixels[(y*w+x)*4+3]>24)return true;return false}
async function prepareTemplateUI(){
 if(presentation)presentation.dispose();
 const scene=svg,layer=document.createElement('div');layer.className='qa-tags';$('#mapmount').append(layer);
 const footLayer=uiElement('g',{'data-layer':'actor-feet','pointer-events':'none'},svg);
 const zones=[...svg.querySelectorAll('[data-forbidden]')].filter(e=>!e.closest('defs'));
 const records=zones.map(node=>({node,box:worldBox(node),mask:null,promise:null}));let actorItems=[],eventItems=[],generation=0;
 const maskFor=async r=>{if(!r.promise)r.promise=paintedMask(r.node).then(m=>r.mask=m);await r.promise;return r.mask};
 function pointSafe(x,y,pad=0){if(!inMap(x,y,pad))return false;for(const r of records){if(x+pad<r.box.x||x-pad>r.box.x+r.box.w||y+pad<r.box.y||y-pad>r.box.y+r.box.h)continue;if(!r.mask)return false;if(maskOverlaps(r.mask,{x:x-pad,y:y-pad,w:Math.max(.1,pad*2),h:Math.max(.1,pad*2)}))return false;}return true}
 async function readyMasks(){await Promise.all(records.map(maskFor))}
 function localPoint(place,inside){const node=[...svg.querySelectorAll('[data-id]')].find(e=>e.dataset.id===place.id&&!e.closest('defs'));if(!node)return null;const b=worldBox(node),center={x:b.x+b.w/2,y:b.y+b.h/2};if(inside)return center;const min=Math.min(originalVB[2],originalVB[3]),step=min/110;
  // Search only the named place's bounds and immediate threshold; never reroute to a different place.
  for(let ring=0;ring<18;ring++)for(let a=0;a<(ring?16:1);a++){const x=center.x+Math.cos(a*Math.PI/8)*ring*step,y=center.y+Math.sin(a*Math.PI/8)*ring*step;if(x<b.x-12||x>b.x+b.w+12||y<b.y-12||y>b.y+b.h+24)continue;if(pointSafe(x,y,5))return{x,y}}
  return null;
 }
 function renderPositions(){if(svg!==scene)return;const base=$('#mapmount').getBoundingClientRect(),ctm=svg.getScreenCTM(),inverse=ctm.inverse();
  for(const item of [...actorItems,...eventItems]){const screen=new DOMPoint(item.point.x,item.point.y).matrixTransform(ctm),a=new DOMPoint(originalVB[0],originalVB[1]).matrixTransform(ctm),b=new DOMPoint(originalVB[0]+originalVB[2],originalVB[1]+originalVB[3]).matrixTransform(ctm),rect=item.element.getBoundingClientRect();const x=Math.max(a.x+rect.width/2,Math.min(b.x-rect.width/2,screen.x)),y=Math.max(a.y+rect.height,Math.min(b.y,screen.y));item.element.style.left=(x-base.left)+'px';item.element.style.top=(y-base.top)+'px'}
  const faded=new Set();for(const a of actorItems){const r=a.element.getBoundingClientRect(),corners=[[r.left,r.top],[r.right,r.bottom]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(inverse)),b={x:corners[0].x,y:corners[0].y,w:corners[1].x-corners[0].x,h:corners[1].y-corners[0].y};
   for(const record of records)if(record.node.dataset.occluder==='building'&&maskOverlaps(record.mask,b))faded.add(record.node);
  }
  for(const r of records)r.node.classList.toggle('occluded',faded.has(r.node));
 }
 function clearActors(){for(const a of actorItems){a.stop?.();a.element.remove();a.feet?.remove()}actorItems=[];renderPositions()}
 async function mountActors(actors=[]){const version=++generation;await readyMasks();if(svg!==scene||version!==generation)return;clearActors();
  for(const actor of actors){const place=(DATA.maps[activeId].places||[]).find(p=>p.id===actor.placeId||p.name===actor.placeName);if(!place)continue;const inside=actor.inside===true||actor.pcSpot==='inside',point=localPoint(place,inside);if(!point)continue;
   const element=actorTag(actor);element.classList.add('npc-tag');element.title=actor.activity||place.name;layer.append(element);
   element.onclick=()=>{put('#place-title',actor.name||'Chưa rõ');put('#drawer-name',actor.name||'Chưa rõ');put('#activity',actor.activity||'');put('#observation',actor.observation||place.desc||'')};
   const stance=inside?'hidden':(['walk','idle','hidden'].includes(actor.footstep)?actor.footstep:'idle');let feet=null,stop=null;
   if(stance!=='hidden'){
    feet=uiElement('g',{class:'footstep',transform:`translate(${point.x} ${point.y}) scale(.6)`},footLayer);stop=mountFeet(feet,stance);
    // Validate each entire shoe silhouette, not only its centre; invalid steps stay hidden.
    const job=[...feetJobs].find(j=>j.g===feet);if(job)job.valid=(use)=>{const b=worldBox(use);for(let y=b.y;y<=b.y+b.h;y+=Math.max(.8,b.h/12))for(let x=b.x;x<=b.x+b.w;x+=Math.max(.8,b.w/8))if(!pointSafe(x,y))return false;return pointSafe(b.x+b.w,b.y+b.h)};
   }
   actorItems.push({point,element,feet,stop,inside,actor,placeId:place.id});
  }showPlaceActors();renderPositions();
 }
 function showPlaceActors(placeId){const target=$('#actors');target.replaceChildren();for(const item of actorItems.filter(a=>!placeId||a.placeId===placeId)){const row=actorTag(item.actor,true);row.onclick=item.element.onclick;target.append(row)}}
 function mountEvents(events=[]){for(const e of eventItems)e.element.remove();eventItems=[];$('#quests').replaceChildren();put('#hintcount',String(events.length));
  for(const event of events){const place=(DATA.maps[activeId].places||[]).find(p=>p.id===event.placeId||p.name===event.placeName);if(!place)continue;const node=[...svg.querySelectorAll('[data-id]')].find(e=>e.dataset.id===place.id);if(!node)continue;const b=worldBox(node),point={x:b.x+b.w/2,y:b.y+b.h/2};
   const button=document.createElement('button');button.className='event-marker '+(event.hidden?'hidden-marker':'');button.setAttribute('aria-label',event.title||'Đầu mối');button.title=event.title||'Đầu mối';
   const v=uiElement('svg',{viewBox:'0 0 24 24','aria-hidden':'true'});if(event.hidden)uiElement('path',{d:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18h.01',fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round'},v);else{uiElement('circle',{cx:10,cy:10,r:6,fill:'none',stroke:'currentColor','stroke-width':2},v);uiElement('path',{d:'m15 15 6 6',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round'},v)}button.append(v);
   button.onclick=()=>{layer.querySelectorAll('.event-marker').forEach(b=>b.classList.remove('chosen'));button.classList.add('chosen');put('#place-title',event.title||'Đầu mối');put('#observation',event.detail||'');};layer.append(button);eventItems.push({point,element:button});const row=document.createElement('button');row.className='event-row';row.textContent=event.title||'Đầu mối';row.onclick=button.onclick;$('#quests').append(row);
  }renderPositions();
 }
 const resize=new ResizeObserver(renderPositions);resize.observe($('#mapmount'));presentation={mountActors,mountEvents,showPlaceActors,renderPositions,pointSafe,readyMasks,get records(){return records},dispose(){generation++;clearActors();resize.disconnect();layer.remove();footLayer.remove();for(const r of records)r.node.classList.remove('occluded')}};
 // Accessibility uses the same selection path as mouse/touch.
 scene.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('[data-id]')){e.preventDefault();eventClick(e)}});
 return presentation;
}
window.WZWTemplateUI={paintedMask,maskOverlaps,setTemplate,mountActors:actors=>presentation.mountActors(actors),mountEvents:events=>presentation.mountEvents(events),get state(){return presentation},get palette(){return TOKENS.colors}};

function bindUI(){
 $('#zoom-in').onclick=()=>zoom(.8);$('#zoom-out').onclick=()=>zoom(1.25);$('#fit').onclick=fit;$('#locate').onclick=fit;
 $('#drawer-toggle').onclick=()=>{const l=$('.layout');l.classList.toggle('drawer-open');$('#drawer-toggle').setAttribute('aria-expanded',String(l.classList.contains('drawer-open')))};
 const source=$('#open-sources');if(source)source.onclick=()=>$('#sources').showModal();
 for(const d of document.querySelectorAll('dialog')){const b=d.querySelector('.close');if(b)b.onclick=()=>d.close()}
 
}




// P1 bootstrap only. P2 owns the full contract and resolver.
function showError(error){put('#place-title','Không dựng được bản đồ');put('#observation',error.message);root.dataset.status='error';}
async function boot(){
 try{
  let input=window.MAP_DATA;
  const transport=document.getElementById('map-data');
  if(transport){try{input=JSON.parse(transport.textContent)}catch{throw Error('MAP_DATA chưa đầy đủ hoặc JSON không hợp lệ.')}}
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Thiếu MAP_DATA.');
  if(!window.WZW_TEMPLATE_PACK)throw Error('Không tải được templates pack.');
  if(!input.atlasAnchor)throw Error('P1 cần atlasAnchor của một Fixed; resolver đầy đủ thuộc P2/P3.');
  const bytes=Uint8Array.from(atob(window.WZW_TEMPLATE_PACK),c=>c.charCodeAt(0));
  DATA=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
  if(!DATA.maps[input.atlasAnchor])throw Error('Fixed chưa được hỗ trợ: '+input.atlasAnchor);
  if(input.actors?.length||input.events?.length||input.places?.length)throw Error('P1 chưa hỗ trợ nội dung RP chi tiết; chờ contract/resolver P2/P3.');
  window.MAP_DATA=input;bindUI();await setTemplate(input.atlasAnchor);
  if(input.meta?.areaName)put('#zone',input.meta.areaName);
  if(input.meta?.quote)document.querySelector('.quote').textContent=input.meta.quote;
  root.dataset.status='ready';root.dataset.renderMs=String(performance.now()-window.WZW_START);
 }catch(error){showError(error);}
}
if(!window.WZW_BOOT){window.WZW_BOOT=true;boot();}

})();
