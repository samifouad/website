export function Lang({ languages, colours }) {
  let total = 0

  const obj = JSON.parse(languages)

  // get total
  for (const [key, value] of Object.entries(obj)) {
    total += value
    //console.log(`${key} has ${value} lines`);
  }

  let return_list = []
  for (const [key, value] of Object.entries(obj)) {
    return_list.push(` ${key} ${Math.round((value / total) * 100)}%`)
  }

  return (
    <div className="text-md">
      {return_list.toString()}
    </div>
    
)
}

