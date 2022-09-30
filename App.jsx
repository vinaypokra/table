import * as React from 'react';
import { useEffect, useState } from 'react';
import './style.css';

const genrateData = (data = []) => {
  const col = data.length && Object.keys(data?.[0]);
  const row = data.map((item) => item);
  return {
    col,
    row,
  };
};

const Table = ({
  data = [],
  rowsPerPage = 4,
  total_pages = 0,
  tableConfig,
  setTableConfig,
}) => {
  const { col = [], row = [] } = genrateData(data);
  const handleChange = (page) => {
    setTableConfig({
      ...tableConfig,
      page,
    });
  };
  return (
    <>
      <table>
        <tr>{col && col.map((item) => <th>{item.split("_").join("").toUpperCase()}</th>)}</tr>
        {row &&
          row.map((item) => (
            <tr>
              {col.map((c) => {
                if (c === 'avatar') {
                  return (
                    <td>
                      <img src={item['avatar']} width="45" height="45" />
                    </td>
                  );
                }
                return <td>{item[c]} </td>;
              })}
            </tr>
          ))}
      </table>
      <div className={'butonGrp'}>
        {new Array(total_pages).fill('').map((item, index) => (
          <button onClick={() => handleChange(index + 1)}>{index + 1}</button>
        ))}
      </div>
    </>
  );
};

export default function App() {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [searchArr, setSearchArr] = useState([]);
  const [tableConfig, setTableConfig] = useState({
    page: 1,
    rowPerPage: 4,
  });
  const getInitData = async () => {
    setLoader(true);
    const response = await fetch(
      `https://reqres.in/api/users?page=${tableConfig.page}`
    );
    let {
      page,
      per_page,
      total,
      total_pages,
      data = [],
    } = await response.json();
    setTableData(data);
    setTableConfig({
      page,
      rowPerPage: per_page,
      total,
      total_pages,
    });
    setLoader(false);
  };

  const { page, rowPerPage } = tableConfig;

  useEffect(() => {
    getInitData();
  }, []);
  useEffect(() => {
    getInitData();
  }, [page]);

  useEffect(() => {
    if (search.length) {
      const temp = [...tableData];
      const filtered = temp.filter((item) =>
        Object.values(item).join('').includes(search)
      );
      console.log('filtered', filtered);
      setSearchArr(filtered);
    }
  }, [search]);
  if (!tableData.length) {
    return <>no data</>;
  }

  return (
    <div>
      <input
        placeholder="search"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      {/* <button onClick={reset}>Reset</button> */}
      {!loader && (
        <Table
          data={searchArr.length ? searchArr : tableData}
          rowsPerPage={rowPerPage}
          setTableConfig={setTableConfig}
          tableConfig={tableConfig}
          total_pages={tableConfig.total_pages}
        />
      )}
    </div>
  );
}
