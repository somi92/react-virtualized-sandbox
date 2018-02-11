import * as React from 'react';
import { GridCellProps, Index, AutoSizer, Grid } from 'react-virtualized';
import customCellRangeRenderer from './cellRangeRenderer';
import { generateRandomList } from '../util/utils';
import * as cn from 'classnames';
import './GroupedGrid.css';

interface GroupedGridState {
    columnCount: number;
    height: number;
    overscanColumnCount: number;
    overscanRowCount: number;
    rowHeight: number;
    rowCount: number;
    scrollToColumn: number | undefined;
    scrollToRow: number | undefined;
    useDynamicRowHeight: boolean;
}

export default class GroupedGrid extends React.PureComponent<{}, GroupedGridState> {

    private list: Array<{
        name: string;
        random: string;
        color: string;
        size: number;
    }>;

    constructor(props: {}) {
        super(props);

        this.list = generateRandomList();

        this.state = {
            columnCount: 1000,
            height: window.innerHeight - 105,
            overscanColumnCount: 0,
            overscanRowCount: 10,
            rowHeight: 50,
            rowCount: 1000,
            scrollToColumn: undefined,
            scrollToRow: undefined,
            useDynamicRowHeight: false,
        };

        this.cellRenderer = this.cellRenderer.bind(this);
        this.getColumnWidth = this.getColumnWidth.bind(this);
        this.getRowClassName = this.getRowClassName.bind(this);
        this.getRowHeight = this.getRowHeight.bind(this);
        this.noContentRenderer = this.noContentRenderer.bind(this);
        this.renderBodyCell = this.renderBodyCell.bind(this);
        this.renderLeftSideCell = this.renderLeftSideCell.bind(this);
    }

    public render(): JSX.Element {
        return (
            <AutoSizer disableHeight={true}>
                {({ width }) => (
                    <Grid
                        cellRenderer={this.cellRenderer}
                        cellRangeRenderer={customCellRangeRenderer}
                        className={'BodyGrid'}
                        columnWidth={this.getColumnWidth}
                        columnCount={this.state.columnCount}
                        height={this.state.height}
                        noContentRenderer={this.noContentRenderer}
                        overscanColumnCount={this.state.overscanColumnCount}
                        overscanRowCount={this.state.overscanRowCount}
                        rowHeight={this.state.useDynamicRowHeight ? this.getRowHeight : this.state.rowHeight}
                        rowCount={this.state.rowCount}
                        scrollToColumn={this.state.scrollToColumn}
                        scrollToRow={this.state.scrollToRow}
                        width={width}
                    />
                )}
            </AutoSizer>
        );
    }

    private cellRenderer({ columnIndex, key, rowIndex, style }: GridCellProps) {
        if (columnIndex === 0) {
            return this.renderLeftSideCell({ columnIndex, key, rowIndex, style });
        } else {
            return this.renderBodyCell({ columnIndex, key, rowIndex, style });
        }
    }

    private getColumnWidth({ index }: Index) {
        switch (index) {
            case 0:
                return 60;
            case 1:
                return 140;
            case 2:
                return 400;
            default:
                return 80;
        }
    }

    private getDatum(index: number) {
        return this.list[index % this.list.length];
    }

    private getRowClassName(row: number) {
        return 'evenRow';
    }

    private getRowHeight({ index }: Index) {
        return this.getDatum(index).size;
    }

    private noContentRenderer() {
        return <div className={'noCells'}>No cells</div>;
    }

    private renderBodyCell({ columnIndex, key, rowIndex, style }: Partial<GridCellProps>) {
        const rowClass = this.getRowClassName(rowIndex as number);
        const datum = this.getDatum(rowIndex as number);

        let content;

        switch (columnIndex) {
            case 1:
                content = datum.name;
                break;
            case 2:
                content = datum.random;
                break;
            default:
                content = `r:${rowIndex}, c:${columnIndex}`;
                break;
        }

        const classNames = cn(rowClass, 'cell', {
            centeredCell: columnIndex as number > 2,
        });

        return (
            <div className={classNames} key={key} style={style}>
                {content}
            </div>
        );
    }

    private renderLeftSideCell({ key, rowIndex, style }: Partial<GridCellProps>) {
        const datum = this.getDatum(rowIndex as number);

        const classNames = cn('cell', 'letterCell');

        // Don't modify styles.
        // These are frozen by React now (as of 16.0.0).
        // Since Grid caches and re-uses them, they aren't safe to modify.
        style = {
            ...style,
            backgroundColor: datum.color,
        };

        return (
            <div className={classNames} key={key} style={style}>
                {datum.name.charAt(0)}
            </div>
        );
    }
}