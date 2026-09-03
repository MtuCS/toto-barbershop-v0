import vietnamAddressData from "@/data/vietnam-address.json"

export interface Ward {
  code: number | string
  name: string
}

export interface District {
  code: number | string
  name: string
  wards: Ward[]
}

export interface Province {
  code: number | string
  name: string
  districts: District[]
}

const provinces: Province[] = vietnamAddressData as Province[]

export function getAllProvinces(): { code: number | string; name: string }[] {
  return provinces.map(p => ({ code: p.code, name: p.name }))
}

export function getDistrictsByProvinceCode(provinceCode: number | string): District[] {
  if (!provinceCode) return []
  const found = provinces.find(p => String(p.code) === String(provinceCode))
  return found ? found.districts : []
}

export function getWardsByDistrictCode(provinceCode: number | string, districtCode: number | string): Ward[] {
  if (!provinceCode || !districtCode) return []
  const districts = getDistrictsByProvinceCode(provinceCode)
  const found = districts.find(d => String(d.code) === String(districtCode))
  return found ? found.wards : []
}

export function findProvinceByName(provinceName: string): Province | undefined {
  if (!provinceName) return undefined
  const clean = provinceName.trim().toLowerCase()
  return provinces.find(p => p.name.toLowerCase() === clean || p.name.toLowerCase().includes(clean))
}

export function findDistrictByName(provinceCode: number | string, districtName: string): District | undefined {
  if (!provinceCode || !districtName) return undefined
  const districts = getDistrictsByProvinceCode(provinceCode)
  const clean = districtName.trim().toLowerCase()
  return districts.find(d => d.name.toLowerCase() === clean || d.name.toLowerCase().includes(clean))
}

export function findWardByName(provinceCode: number | string, districtCode: number | string, wardName: string): Ward | undefined {
  if (!provinceCode || !districtCode || !wardName) return undefined
  const wards = getWardsByDistrictCode(provinceCode, districtCode)
  const clean = wardName.trim().toLowerCase()
  return wards.find(w => w.name.toLowerCase() === clean || w.name.toLowerCase().includes(clean))
}
